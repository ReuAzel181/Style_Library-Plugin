    const statusMsg = document.getElementById('status-msg');
    const progressFill = document.getElementById('progress-fill');
    const progressTrack = document.getElementById('progress-track');
    const actionBtn = document.getElementById('action-btn');
    const collectionList = document.getElementById('collection-list');
    const groupList = document.getElementById('group-list');
    const groupSidebar = document.getElementById('group-sidebar');
    const tableContainer = document.getElementById('table-container');
    const viewTitle = document.getElementById('view-title');
    const tokenTotal = document.getElementById('token-total');
    const duplicateNotice = document.getElementById('duplicate-notice');
    const selectionCount = document.getElementById('selection-count');
    
    let modesData = null;
    let primitivesData = null;
    let modesExist = false;
    let primitivesExist = false;
    let activeCollection = null; // 'modes' | 'primitives'
    let activeGroupPath = 'All';
    let state = 'init';
    let collapsedGroups = new Set();

    // Undo/Redo State
    let history = [];
    let historyIndex = -1;
    const MAX_HISTORY = 50;

    function saveToHistory() {
      // Remove any redo history
      if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
      }
      
      const snapshot = JSON.parse(JSON.stringify({
        modesData,
        primitivesData,
        activeCollection,
        activeGroupPath
      }));
      
      history.push(snapshot);
      if (history.length > MAX_HISTORY) history.shift();
      else historyIndex++;
    }

    function undo() {
      if (historyIndex > 0) {
        historyIndex--;
        applyHistoryState(history[historyIndex]);
      }
    }

    function redo() {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        applyHistoryState(history[historyIndex]);
      }
    }

    function applyHistoryState(stateObj) {
      modesData = stateObj.modesData;
      primitivesData = stateObj.primitivesData;
      activeCollection = stateObj.activeCollection;
      activeGroupPath = stateObj.activeGroupPath;
      
      renderSidebar();
      const data = activeCollection === 'modes' ? modesData : primitivesData;
      if (data) {
        viewTitle.textContent = data.name;
        renderTable(data);
      }
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    });

    // Dark Mode Toggle
    let themeLock = false;
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.removeAttribute('title'); // Remove tooltip
    themeToggle.onclick = (event) => {
      if (themeLock) return;
      themeLock = true;
      
      const x = event.clientX;
      const y = event.clientY;
      const isDark = document.body.classList.contains('dark');
      
      const toggleTheme = () => {
        document.body.classList.toggle('dark');
        const nowDark = document.body.classList.contains('dark');
        themeToggle.innerHTML = nowDark 
          ? '<svg viewBox="0 0 24 24" style="width:16px; height:16px;"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2.5"></circle><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2.5"></line><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2.5"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2.5"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2.5"></line><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2.5"></line><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2.5"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2.5"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2.5"></line></svg>'
          : '<svg viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2.5"></path></svg>';
      };

      if (document.startViewTransition) {
        document.documentElement.style.setProperty("--ripple-x", `${x}px`);
        document.documentElement.style.setProperty("--ripple-y", `${y}px`);
        const transition = document.startViewTransition(toggleTheme);
        transition.finished.finally(() => { themeLock = false; });
      } else {
        const ripple = document.createElement('div');
        ripple.className = 'theme-ripple-circle theme-ripple-animate';
        ripple.style.setProperty("--ripple-x", `${x}px`);
        ripple.style.setProperty("--ripple-y", `${y}px`);
        // New theme color
        ripple.style.background = isDark ? '#ffffff' : '#1e1e1e';
        document.body.appendChild(ripple);
        
        setTimeout(() => {
          toggleTheme();
          setTimeout(() => {
            ripple.remove();
            themeLock = false;
          }, 800);
        }, 50);
      }
    };

    parent.postMessage({ pluginMessage: { type: 'check-collections' } }, '*');

    function updateStatus(text, success = false) {
      statusMsg.textContent = text;
      if (success) {
        setTimeout(() => {
          statusMsg.textContent = 'Ready';
          progressTrack.style.display = 'none';
          progressFill.style.width = '0%';
        }, 3000);
      }
    }

    actionBtn.onclick = () => {
      if (state === 'init') {
        updateStatus('Fetching library data...');
        parent.postMessage({ pluginMessage: { type: 'request-token-data' } }, '*');
      } else {
        progressTrack.style.display = 'block';
        progressFill.style.width = '40%';
        updateStatus('Syncing to Figma...');
        
        const saveEdits = (data) => {
          data.variables.forEach(v => {
            // Update name (leaf only in UI, but we should restore full path if it was there)
            const nameInput = document.getElementById(`in-${v.id}`);
            if (nameInput) {
              const parts = v.name.split('/');
              if (parts.length > 1) {
                parts[parts.length - 1] = nameInput.value;
                v.name = parts.join('/');
              } else {
                v.name = nameInput.value;
              }
            }

            // Update mode values
            Object.keys(data.modes).forEach(mId => {
              const valInput = document.getElementById(`val-${v.id}-${mId}`);
              if (valInput) {
                let newVal = valInput.value;
                
                // Basic type casting
                if (v.type === 'FLOAT') {
                  v.valuesByMode[mId] = parseFloat(newVal);
                } else if (v.type === 'COLOR' && v.valuesByMode[mId]?.r !== undefined) {
                  // If it's a hex string, we might need complex conversion, 
                  // but for now we'll assume they edit the stringified RGBA or hex
                  // Simple support for hex if needed, but let's stick to text for raw edits
                  try {
                    if (newVal.startsWith('#')) {
                      // Simple hex to rgb logic
                      const r = parseInt(newVal.slice(1,3), 16) / 255;
                      const g = parseInt(newVal.slice(3,5), 16) / 255;
                      const b = parseInt(newVal.slice(5,7), 16) / 255;
                      v.valuesByMode[mId] = { r, g, b, a: 1 };
                    } else {
                      v.valuesByMode[mId] = JSON.parse(newVal);
                    }
                  } catch(e) { v.valuesByMode[mId] = newVal; }
                } else {
                  v.valuesByMode[mId] = newVal;
                }
              }
            });
          });
        };
        
        saveEdits(modesData);
        saveEdits(primitivesData);

        parent.postMessage({ 
          pluginMessage: { 
            type: 'request-import',
            data: { modesData, primitivesData }
          } 
        }, '*');
      }
    };

    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      
      if (msg.type === 'collections-status') {
        modesExist = msg.modesExist;
        primitivesExist = msg.primitivesExist;
        modesData = msg.preview.modes;
        primitivesData = msg.preview.primitives;
        
        renderSidebar();
        
        if (modesExist && primitivesExist) {
          actionBtn.disabled = true;
        } else {
          actionBtn.disabled = false;
        }
      }

      if (msg.type === 'token-data-response') {
        modesData = msg.modes;
        primitivesData = msg.primitives;
        state = 'sync';
        actionBtn.textContent = 'Sync to Variables';
        actionBtn.disabled = false;
        
        selectCollection('primitives');
        updateStatus('Review content before syncing');
      }

      if (msg.type === 'status-update') {
        progressFill.style.width = '100%';
        updateStatus(msg.message, true);
        state = 'init';
        actionBtn.textContent = 'Load Library for Review';
        parent.postMessage({ pluginMessage: { type: 'check-collections' } }, '*');
      }

      if (msg.type === 'selection-change') {
        selectionCount.textContent = `${msg.count} selected`;
      }
    };

    function renderSidebar() {
      collectionList.innerHTML = '';
      const items = [
        { id: 'primitives', name: 'Primitives', exists: primitivesExist, count: primitivesData ? primitivesData.variables.length : 0 },
        { id: 'modes', name: 'Modes (Desktop / Mobile)', exists: modesExist, count: modesData ? modesData.variables.length : 0 }
      ];

      items.forEach(item => {
        const el = document.createElement('div');
        el.className = `collection-item ${activeCollection === item.id ? 'active' : ''}`;
        el.innerHTML = `
          <div style="display: flex; flex-direction: column; flex: 1;">
            <span style="font-size: 12px;">${item.name}</span>
          </div>
          <span style="font-size: 11px; color: var(--muted); opacity: 0.8;">${item.count}</span>
        `;
        el.onclick = () => selectCollection(item.id);
        collectionList.appendChild(el);
      });

      if (activeCollection) {
        groupSidebar.style.display = 'block';
        renderGroups();
      } else {
        groupSidebar.style.display = 'none';
      }
    }

    function buildHierarchy(variables) {
      const root = { name: 'All', count: variables.length, children: {} };
      
      variables.forEach(v => {
        const parts = v.name.split('/');
        let current = root;
        
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!current.children[part]) {
            current.children[part] = { name: part, count: 0, children: {} };
          }
          current.children[part].count++;
          current = current.children[part];
        }
      });
      
      return root;
    }

    function renderGroups() {
      groupList.innerHTML = '';
      const data = activeCollection === 'modes' ? modesData : primitivesData;
      if (!data) return;

      const hierarchy = buildHierarchy(data.variables);
      
      const renderNode = (node, container, path = '', level = 0) => {
        const fullPath = path ? `${path}/${node.name}` : node.name;
        const isAll = node.name === 'All';
        const displayPath = isAll ? 'All' : fullPath.replace('All/', '');
        
        const itemEl = document.createElement('div');
        const hasChildren = Object.keys(node.children).length > 0;
        const isCollapsed = collapsedGroups.has(displayPath);
        
        itemEl.className = `group-item ${activeGroupPath === displayPath ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`;
        
        let indent = '';
        for(let i=0; i<level; i++) indent += '<div class="group-indent"></div>';

        itemEl.innerHTML = `
          ${indent}
          ${hasChildren ? '<svg class="group-arrow" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="3"></path></svg>' : '<div class="group-indent"></div>'}
          <span class="group-title" style="${isAll ? 'font-weight: 800;' : ''}">${node.name}</span>
          <span class="group-count">${node.count}</span>
        `;

        itemEl.onclick = (e) => {
          if (hasChildren) {
            const childrenContainer = itemEl.nextElementSibling;
            if (isCollapsed) {
              collapsedGroups.delete(displayPath);
              itemEl.classList.remove('collapsed');
              if (childrenContainer) {
                childrenContainer.style.display = 'block';
                const height = childrenContainer.scrollHeight;
                childrenContainer.style.height = '0px';
                childrenContainer.offsetHeight; // force reflow
                childrenContainer.style.height = height + 'px';
                setTimeout(() => { childrenContainer.style.height = 'auto'; }, 300);
              }
            } else {
              collapsedGroups.add(displayPath);
              itemEl.classList.add('collapsed');
              if (childrenContainer) {
                childrenContainer.style.height = childrenContainer.scrollHeight + 'px';
                childrenContainer.offsetHeight; // force reflow
                childrenContainer.style.height = '0px';
                setTimeout(() => { childrenContainer.style.display = 'none'; }, 300);
              }
            }
          }
          selectGroup(displayPath);
        };

        container.appendChild(itemEl);

        if (hasChildren) {
          const childrenContainer = document.createElement('div');
          childrenContainer.className = 'group-children';
          childrenContainer.style.display = isCollapsed ? 'none' : 'block';
          container.appendChild(childrenContainer);

          const sortedChildren = Object.keys(node.children).sort();
          sortedChildren.forEach(childName => {
            renderNode(node.children[childName], childrenContainer, fullPath, level + 1);
          });
        }
      };

      renderNode(hierarchy, groupList);
    }

    function selectGroup(path) {
      activeGroupPath = path;
      renderGroups();
      const data = activeCollection === 'modes' ? modesData : primitivesData;
      renderTable(data);
    }

    function selectCollection(id) {
      const listContainer = document.querySelector('.sidebar-list-container');
      listContainer.style.opacity = '0';
      
      setTimeout(() => {
        activeCollection = id;
        activeGroupPath = 'All';
        collapsedGroups.clear();
        renderSidebar();
        
        const data = id === 'modes' ? modesData : primitivesData;
        const exists = id === 'modes' ? modesExist : primitivesExist;
        
        viewTitle.textContent = data.name;
        duplicateNotice.style.display = exists ? 'flex' : 'none';
        
        if (state === 'sync') {
          renderTable(data);
        }
        listContainer.style.opacity = '1';
      }, 200);
    }

    function renderTable(data) {
      const modeKeys = Object.keys(data.modes);
      const modeNames = Object.values(data.modes);
      
      const filteredVars = activeGroupPath === 'All' 
        ? data.variables 
        : data.variables.filter(v => v.name.startsWith(activeGroupPath + '/'));

      tokenTotal.textContent = `${filteredVars.length} tokens`;

      let html = `
        <table>
          <thead>
            <tr>
              <th class="col-name">Name</th>
              ${modeNames.map(name => `<th class="col-mode">${name}</th>`).join('')}
              <th class="col-empty"></th>
            </tr>
          </thead>
          <tbody>
      `;

      const hexagonIcon = '<svg viewBox="0 0 24 24" style="width:14px;height:14px;opacity:0.6;"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" fill="none" stroke="currentColor" stroke-width="2.5"></path><circle cx="12" cy="12" r="3" fill="currentColor"></circle></svg>';
      const unlinkIcon = '<svg viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M18.84 15.16l1.16-1.16a5 5 0 0 0-7.07-7.07l-1.16 1.16M14 11l-4 4M5.16 8.84L4 10a5 5 0 0 0 7.07 7.07l1.16-1.16M2 2l20 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></path></svg>';

      function getTypeIcon(symbol, size = 20) {
        return `
          <div class="type-icon" style="width:${size}px; height:${size}px; position:relative;">
            <svg viewBox="0 0 24 24" style="width:100%; height:100%; position:absolute; top:0; left:0;">
              <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"></rect>
            </svg>
            <span style="position:relative; z-index:1; font-size:${size * 0.5}px;">${symbol}</span>
          </div>
        `;
      }

      filteredVars.forEach(v => {
        const parts = v.name.split('/');
        const leafName = parts[parts.length - 1];
        const normalizedLeaf = leafName.toLowerCase().replace(/[-_]/g, ' ');
        const isFontFamily = normalizedLeaf.includes('font family');
        const isFontWeight = normalizedLeaf.includes('font weight');
        
        let typeSymbol = '#';
        if (v.type === 'COLOR') typeSymbol = '◐';
        if (v.type === 'STRING') typeSymbol = 'T';
        if (v.type === 'BOOLEAN') typeSymbol = 'B';

        html += `
          <tr>
            <td onclick="focusInput('in-${v.id}')">
              <div class="cell-content">
                ${getTypeIcon(typeSymbol)}
                <input type="text" class="table-input" id="in-${v.id}" value="${leafName}" placeholder="Variable Name" 
                  onblur="updateVariableName('${v.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
              </div>
            </td>
            ${modeKeys.map(mId => {
              const val = v.valuesByMode[mId];
              const resolved = v.resolvedValuesByMode?.[mId];
              
              if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
                // Alias UI
                const aliasName = resolved?.aliasName || 'Unknown Alias';
                const aliasParts = aliasName.split('/');
                const displayAlias = aliasParts.length > 1 
                  ? `...${aliasParts[aliasParts.length-2]}/${aliasParts[aliasParts.length-1]}`
                  : aliasName;

                return `
                  <td>
                    <div class="cell-content">
                      <div class="alias-pill" title="${aliasName}" onclick="showPicker('${v.id}', '${mId}', event)">
                        ${getTypeIcon(typeSymbol, 12)}
                        <span class="alias-name">${displayAlias}</span>
                      </div>
                      <div class="link-btn" title="Unlink" onclick="unlinkAlias('${v.id}', '${mId}')">
                        ${unlinkIcon}
                      </div>
                    </div>
                  </td>
                `;
              }

              if (v.type === 'COLOR') {
                const color = val || { r: 0, g: 0, b: 0, a: 1 };
                const hex = color.r !== undefined ? 
                  `#${Math.round(color.r * 255).toString(16).padStart(2, '0')}${Math.round(color.g * 255).toString(16).padStart(2, '0')}${Math.round(color.b * 255).toString(16).padStart(2, '0')}`.toUpperCase() : 
                  (typeof val === 'string' ? val : '#000000');
                
                const alpha = color.a !== undefined ? color.a : 1;
                const opacityPercent = Math.round(alpha * 100);

                if (alpha < 1) {
                  return `
                    <td onclick="openColorPicker('${v.id}', '${mId}', event)">
                      <div class="cell-content">
                        <div class="color-opacity-row">
                          <div class="color-swatch-picker" style="background-color: rgba(${color.r*255},${color.g*255},${color.b*255},${alpha})"></div>
                          <span style="font-weight:500; font-size:11px; color:var(--fg); line-height:1;" class="themed-text">${hex.slice(1)}</span>
                          <div class="opacity-separator"></div>
                          <div class="opacity-value">
                            <span class="themed-text">${opacityPercent}</span>
                            <span style="opacity:0.5;" class="themed-text">%</span>
                          </div>
                        </div>
                        <div class="link-btn" title="Link to Variable" onclick="showPicker('${v.id}', '${mId}', event); event.stopPropagation();">
                          ${hexagonIcon}
                        </div>
                      </div>
                    </td>
                  `;
                }

                return `
                  <td onclick="openColorPicker('${v.id}', '${mId}', event)">
                    <div class="cell-content">
                      <div class="color-swatch-picker" style="background-color: ${hex}"></div>
                      <span class="table-input" style="flex:1;">${hex}</span>
                      <div class="link-btn" title="Link to Variable" onclick="showPicker('${v.id}', '${mId}', event); event.stopPropagation();">
                        ${hexagonIcon}
                      </div>
                    </div>
                  </td>
                `;
              }

              // Font specific UI
              if (isFontFamily || isFontWeight) {
                const displayVal = typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
                return `
                  <td onclick="showFontPicker('${v.id}', '${mId}', '${isFontFamily ? 'family' : 'weight'}', event)">
                    <div class="cell-content">
                      <input type="text" class="table-input" id="val-${v.id}-${mId}" value="${displayVal}" readonly style="cursor: pointer;">
                      <div class="link-btn" title="Link to Variable" onclick="showPicker('${v.id}', '${mId}', event); event.stopPropagation();">
                        ${hexagonIcon}
                      </div>
                    </div>
                  </td>
                `;
              }

              // Default Text/Number input
              const displayVal = typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
              return `
                <td onclick="focusInput('val-${v.id}-${mId}')">
                  <div class="cell-content">
                    <input type="text" class="table-input" id="val-${v.id}-${mId}" value="${displayVal}" placeholder="Value"
                      onblur="updateVariableValue('${v.id}', '${mId}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
                    <div class="link-btn" title="Link to Variable" onclick="showPicker('${v.id}', '${mId}', event); event.stopPropagation();">
                      ${hexagonIcon}
                    </div>
                  </div>
                </td>
              `;
            }).join('')}
            <td class="col-empty"></td>
          </tr>
        `;
      });

      html += '</tbody></table>';
      tableContainer.innerHTML = html;
    }

    window.unlinkAlias = (vId, mId) => {
      saveToHistory();
      // Find the variable in our data and convert alias to its resolved value
      const findVar = (data) => {
        const v = data.variables.find(item => item.id === vId);
        if (v && v.valuesByMode[mId]?.type === 'VARIABLE_ALIAS') {
          const resolved = v.resolvedValuesByMode?.[mId]?.resolvedValue;
          v.valuesByMode[mId] = resolved;
          renderTable(data);
        }
      };
      findVar(modesData);
      findVar(primitivesData);
    };

    window.updateColorValue = (vId, mId, hex) => {
      document.getElementById(`val-${vId}-${mId}`).value = hex.toUpperCase();
      const picker = document.querySelector(`#val-${vId}-${mId}`).previousElementSibling;
      picker.style.background = hex;
    };

    window.updateSwatch = (vId, mId, hex) => {
      if (hex.match(/^#[0-9A-F]{6}$/i)) {
        const picker = document.querySelector(`#val-${vId}-${mId}`).previousElementSibling;
        if (picker) {
          picker.style.background = hex;
          const input = picker.querySelector('input');
          if (input) input.value = hex;
        }
      }
    };

    window.focusInput = (id) => {
      const input = document.getElementById(id);
      if (input) {
        input.focus();
        // Move cursor to the right (end of text)
        const val = input.value;
        input.setSelectionRange(val.length, val.length);
      }
    };

    // Color Picker State & Logic
    let cpContext = null;
    let cpColor = { h: 0, s: 100, l: 50, a: 1 };
    const cpModal = document.getElementById('color-picker-modal');
    const cpSatVal = document.getElementById('cp-sat-val');
    const cpCursor = document.getElementById('cp-cursor');
    const cpHue = document.getElementById('cp-hue');
    const cpAlpha = document.getElementById('cp-alpha');
    const cpHueLabel = document.getElementById('cp-hue-label');
    const cpAlphaLabel = document.getElementById('cp-alpha-label');
    const cpModeSelect = document.getElementById('cp-mode-select');
    const cpInputContainer = document.getElementById('cp-input-container');

    window.openColorPicker = (vId, mId, event) => {
      cpContext = { vId, mId };
      const targetVar = modesData.variables.find(v => v.id === vId) || primitivesData.variables.find(v => v.id === vId);
      const val = targetVar.valuesByMode[mId] || { r: 0, g: 0, b: 0, a: 1 };
      
      // Convert RGB to HSL
      const { r, g, b, a } = val;
      cpColor = rgbToHsl(r, g, b, a);
      
      const rect = event.currentTarget.getBoundingClientRect();
      cpModal.style.display = 'flex';
      cpModal.style.top = `${Math.min(rect.bottom + 5, window.innerHeight - 350)}px`;
      cpModal.style.left = `${Math.min(rect.left, window.innerWidth - 260)}px`;
      
      updateCPUI();
    };

    window.hideColorPicker = () => {
      cpModal.style.display = 'none';
      cpContext = null;
    };

    function updateCPUI() {
      const { h, s, l, a } = cpColor;
      cpSatVal.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
      
      // Saturation/Lightness to X/Y (approximate for UI)
      cpCursor.style.left = `${s}%`;
      cpCursor.style.top = `${100 - l}%`;
      
      cpHue.value = h;
      cpAlpha.value = a * 100;
      
      // Update labels
      cpHueLabel.textContent = `Hue ${Math.round(h)}°`;
      cpAlphaLabel.textContent = `Opacity ${Math.round(a * 100)}%`;
      
      // Update Alpha slider background
      const rgb = hslToRgb(h, s, l);
      const isDark = document.body.classList.contains('dark');
      const c1 = isDark ? '#222' : '#eee';
      const c2 = isDark ? '#333' : '#fff';
      cpAlpha.style.color = `rgba(${rgb.r},${rgb.g},${rgb.b},1)`;
      cpAlpha.style.backgroundImage = `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b},0), rgba(${rgb.r},${rgb.g},${rgb.b},1)), conic-gradient(${c1} 0.25turn, ${c2} 0.25turn 0.5turn, ${c1} 0.5turn 0.75turn, ${c2} 0.75turn)`;

      renderCPInputs();
    }

    function renderCPInputs() {
      const mode = cpModeSelect.value;
      cpInputContainer.innerHTML = '';
      const { h, s, l, a } = cpColor;
      
      const inputGroup = document.createElement('div');
      inputGroup.className = 'cp-input-group';

      if (mode === 'HSL') {
        inputGroup.innerHTML = `
          <input type="number" class="cp-input" value="${Math.round(h)}" oninput="updateCPColor('h', this.value)">
          <input type="number" class="cp-input" value="${Math.round(s)}" oninput="updateCPColor('s', this.value)">
          <input type="number" class="cp-input" value="${Math.round(l)}" oninput="updateCPColor('l', this.value)">
          <input type="number" class="cp-input" value="${Math.round(a*100)}" oninput="updateCPColor('a', this.value/100)">
          <span class="cp-input-percent">%</span>
        `;
      } else if (mode === 'RGB') {
        const rgb = hslToRgb(h, s, l);
        inputGroup.innerHTML = `
          <input type="number" class="cp-input" value="${Math.round(rgb.r)}" oninput="updateCPRGB('r', this.value)">
          <input type="number" class="cp-input" value="${Math.round(rgb.g)}" oninput="updateCPRGB('g', this.value)">
          <input type="number" class="cp-input" value="${Math.round(rgb.b)}" oninput="updateCPRGB('b', this.value)">
          <input type="number" class="cp-input" value="${Math.round(a*100)}" oninput="updateCPColor('a', this.value/100)">
          <span class="cp-input-percent">%</span>
        `;
      } else {
        const rgb = hslToRgb(h, s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        inputGroup.innerHTML = `
          <input type="text" class="cp-input" style="flex: 2;" value="${hex}" oninput="updateCPHex(this.value)">
          <input type="number" class="cp-input" value="${Math.round(a*100)}" oninput="updateCPColor('a', this.value/100)">
          <span class="cp-input-percent">%</span>
        `;
      }
      
      cpInputContainer.appendChild(inputGroup);
    }

    window.handleCPUnlink = () => {
      if (cpContext) {
        unlinkAlias(cpContext.vId, cpContext.mId);
        hideColorPicker();
      }
    };

    window.updateCPColor = (key, val) => {
      cpColor[key] = parseFloat(val);
      updateCPUI();
      applyCPColor();
    };

    window.updateCPRGB = (key, val) => {
      const { h, s, l } = cpColor;
      const rgb = hslToRgb(h, s, l);
      rgb[key] = parseInt(val);
      const newHsl = rgbToHsl(rgb.r/255, rgb.g/255, rgb.b/255, cpColor.a);
      cpColor.h = newHsl.h;
      cpColor.s = newHsl.s;
      cpColor.l = newHsl.l;
      updateCPUI();
      applyCPColor();
    };

    window.updateCPHex = (hex) => {
      if (hex.startsWith('#')) hex = hex.slice(1);
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const hsl = rgbToHsl(r/255, g/255, b/255, cpColor.a);
        cpColor.h = hsl.h;
        cpColor.s = hsl.s;
        cpColor.l = hsl.l;
        updateCPUI();
        applyCPColor();
      }
    };

    function applyCPColor() {
      if (!cpContext) return;
      const { vId, mId } = cpContext;
      const rgb = hslToRgb(cpColor.h, cpColor.s, cpColor.l);
      const val = { r: rgb.r/255, g: rgb.g/255, b: rgb.b/255, a: cpColor.a };
      
      const updateData = (data) => {
        const v = data.variables.find(item => item.id === vId);
        if (v) {
          v.valuesByMode[mId] = val;
          renderTable(data);
        }
      };
      updateData(modesData);
      updateData(primitivesData);
    }

    cpHue.oninput = (e) => updateCPColor('h', e.target.value);
    cpAlpha.oninput = (e) => updateCPColor('a', e.target.value / 100);
    cpModeSelect.onchange = () => renderCPInputs();

    cpSatVal.onmousedown = (e) => {
      const move = (ev) => {
        const rect = cpSatVal.getBoundingClientRect();
        let x = (ev.clientX - rect.left) / rect.width;
        let y = (ev.clientY - rect.top) / rect.height;
        x = Math.max(0, Math.min(1, x));
        y = Math.max(0, Math.min(1, y));
        cpColor.s = x * 100;
        cpColor.l = (1 - y) * 100;
        updateCPUI();
        applyCPColor();
      };
      move(e);
      window.onmousemove = move;
      window.onmouseup = () => { window.onmousemove = null; window.onmouseup = null; };
    };

    // Color Helpers
    function rgbToHsl(r, g, b, a) {
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) { h = s = 0; } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: h * 360, s: s * 100, l: l * 100, a };
    }

    function hslToRgb(h, s, l) {
      h /= 360; s /= 100; l /= 100;
      let r, g, b;
      if (s === 0) { r = g = b = l; } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const hue2rgb = (t) => {
          if (t < 0) t += 1; if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        r = hue2rgb(h + 1/3); g = hue2rgb(h); b = hue2rgb(h - 1/3);
      }
      return { r: r * 255, g: g * 255, b: b * 255 };
    }

    function rgbToHex(r, g, b) {
      const toHex = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    window.updateVariableName = (vId, name) => {
      saveToHistory();
      const v = modesData.variables.find(item => item.id === vId) || primitivesData.variables.find(item => item.id === vId);
      if (v) v.name = name;
    };

    window.updateVariableValue = (vId, mId, val) => {
      saveToHistory();
      const v = modesData.variables.find(item => item.id === vId) || primitivesData.variables.find(item => item.id === vId);
      if (v) {
        if (v.type === 'FLOAT') v.valuesByMode[mId] = parseFloat(val);
        else v.valuesByMode[mId] = val;
      }
    };

    // Variable Picker Logic
    let currentPickerContext = null;
    const pickerOverlay = document.getElementById('picker-overlay');
    const pickerList = document.getElementById('picker-list');
    const pickerSearchInput = document.getElementById('picker-search-input');





    window.showFontPicker = (vId, mId, type, event) => {
      currentPickerContext = { vId, mId, type };
      pickerOverlay.style.display = 'block';
      const picker = document.getElementById('variable-picker');
      picker.style.display = 'flex';
      
      // Update UI for font picker - always show "Google Fonts"
      document.getElementById('picker-title').textContent = 'Google Fonts';
      
      const rect = event.currentTarget.getBoundingClientRect();
      picker.style.top = `${Math.min(rect.bottom + 5, window.innerHeight - 410)}px`;
      picker.style.left = `${Math.min(rect.left, window.innerWidth - 270)}px`;
      
      pickerSearchInput.value = '';
      pickerSearchInput.placeholder = type === 'family' ? "Search fonts" : "Select weight";
      pickerSearchInput.focus();
      
      renderFontPickerOptions(type, '');
    };

    window.filterPickerResults = (query) => {
      if (currentPickerContext?.type === 'family' || currentPickerContext?.type === 'weight') {
        renderFontPickerOptions(currentPickerContext.type, query);
      } else {
        renderPickerList(query);
      }
    };

    function renderFontPickerOptions(type, query = '') {
      pickerList.innerHTML = '';
      const { vId, mId } = currentPickerContext;
      const data = activeCollection === 'modes' ? modesData : primitivesData;
      const currentVar = data.variables.find(v => v.id === vId);

      if (type === 'family') {
        const filtered = GOOGLE_FONTS.filter(f => f.family.toLowerCase().includes(query.toLowerCase()));
        
        filtered.forEach((font, index) => {
          // Add the base family entry
          const opt = document.createElement('div');
          opt.className = 'font-picker-item';
          opt.dataset.family = font.family;
          opt.innerHTML = `<span>${font.family}</span>`;
          opt.onclick = () => {
            updateVariableValue(vId, mId, font.family);
            syncSiblingWeight(data, currentVar, mId, font, 'Regular');
            hidePicker();
            renderTable(data);
          };
          pickerList.appendChild(opt);

          // If searching or specifically for families like Abhaya Libre, show variants like in the image
          if (query.length > 0 || ['Abhaya Libre', 'Alegreya', 'Inter', 'Montserrat', 'Roboto', 'Poppins'].includes(font.family)) {
            font.weights.forEach(weight => {
              if (weight === 'Regular') return; // Skip regular as it's the base family entry
              const vOpt = document.createElement('div');
              vOpt.className = 'font-picker-item variant';
              vOpt.dataset.family = font.family;
              vOpt.dataset.weight = weight;
              vOpt.style.fontSize = '13px'; // Slightly larger to show style better
              vOpt.style.opacity = '0.9';
              
              const weightMap = {
                'Thin': 100, 'ExtraLight': 200, 'Light': 300, 'Regular': 400,
                'Medium': 500, 'SemiBold': 600, 'Bold': 700, 'ExtraBold': 800, 'Black': 900
              };
              const isItalic = weight.toLowerCase().includes('italic');
              const baseWeight = weight.replace('Italic', '');
              
              vOpt.style.fontWeight = weightMap[baseWeight] || 400;
              vOpt.style.fontStyle = isItalic ? 'italic' : 'normal';
              
              vOpt.innerHTML = `<span>${font.family} ${weight}</span>`;
              vOpt.onclick = () => {
                updateVariableValue(vId, mId, font.family);
                syncSiblingWeight(data, currentVar, mId, font, weight);
                hidePicker();
                renderTable(data);
              };
              pickerList.appendChild(vOpt);
            });
          }
        });

        // Initialize lazy loading for fonts
        initFontLazyLoading();
      } else {
        // ... (weight picker logic remains same)
        renderWeightOptions(data, currentVar, mId, query);
      }
    }

    function initFontLazyLoading() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const family = el.dataset.family;
            if (family) {
              loadGoogleFontPreview(family);
              el.style.fontFamily = `"${family}", sans-serif`;
              observer.unobserve(el);
            }
          }
        });
      }, { root: pickerList, rootMargin: '50px' });

      pickerList.querySelectorAll('.font-picker-item').forEach(item => observer.observe(item));
    }

    const loadedFonts = new Set();
    function loadGoogleFontPreview(family) {
      if (loadedFonts.has(family)) return;
      loadedFonts.add(family);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      // Use the 'text' parameter to only load characters for the family name + weight names
      // This makes loading extremely fast and avoids "all fonts same" issue
      const encodedFamily = family.replace(/ /g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${encodedFamily}&text=${encodeURIComponent(family + " ThinExtraLightLightMediumSemiBoldBoldExtraBoldBlackItalic")}&display=swap`;
      document.head.appendChild(link);
    }

    function syncSiblingWeight(data, currentVar, mId, font, preferredWeight) {
      const parts = currentVar.name.split('/');
      const basePath = parts.slice(0, -1).join('/');
      const weightVar = data.variables.find(v => {
        const vParts = v.name.split('/');
        const vBase = vParts.slice(0, -1).join('/');
        const vLeaf = vParts[vParts.length - 1].toLowerCase().replace(/[-_]/g, ' ');
        return vBase === basePath && vLeaf === 'font weight';
      });
      
      if (weightVar) {
        const targetWeight = font.weights.includes(preferredWeight) ? preferredWeight : (font.weights.includes('Regular') ? 'Regular' : font.weights[0]);
        updateVariableValue(weightVar.id, mId, targetWeight);
      }
    }

    function renderWeightOptions(data, currentVar, mId, query) {
      // Find the sibling font family variable
      const parts = currentVar.name.split('/');
      const basePath = parts.slice(0, -1).join('/');
      const familyVar = data.variables.find(v => {
        const vParts = v.name.split('/');
        const vBase = vParts.slice(0, -1).join('/');
        const vLeaf = vParts[vParts.length - 1].toLowerCase().replace(/[-_]/g, ' ');
        return vBase === basePath && vLeaf === 'font family';
      });
      
      let currentFamily = 'Inter';
      if (familyVar) {
        const rawVal = familyVar.valuesByMode[mId];
        if (rawVal && typeof rawVal === 'object' && rawVal.type === 'VARIABLE_ALIAS') {
          const resolved = familyVar.resolvedValuesByMode?.[mId];
          currentFamily = resolved?.resolvedValue || 'Inter';
        } else {
          currentFamily = rawVal || 'Inter';
        }
      }

      const font = GOOGLE_FONTS.find(f => f.family === currentFamily) || GOOGLE_FONTS.find(f => f.family === 'Inter');
      
      if (font) {
        loadGoogleFontPreview(font.family);
        
        const weightMap = {
          'Thin': 100, 'ExtraLight': 200, 'Light': 300, 'Regular': 400,
          'Medium': 500, 'SemiBold': 600, 'Bold': 700, 'ExtraBold': 800, 'Black': 900
        };
        
        const filteredWeights = font.weights.filter(w => w.toLowerCase().includes(query.toLowerCase()));
        filteredWeights.forEach(weight => {
          const opt = document.createElement('div');
          opt.className = 'font-picker-item';
          const isItalic = weight.toLowerCase().includes('italic');
          const baseWeight = weight.replace('Italic', '');
          const fontWeightNum = weightMap[baseWeight] || 400;
          
          opt.style.fontFamily = `"${font.family}", sans-serif`;
          opt.style.fontWeight = fontWeightNum;
          opt.style.fontStyle = isItalic ? 'italic' : 'normal';
          
          opt.innerHTML = `<span>${weight}</span>`;
          opt.onclick = () => {
            updateVariableValue(currentVar.id, mId, weight);
            hidePicker();
            renderTable(data);
          };
          pickerList.appendChild(opt);
        });
      }
    }

    window.showPicker = (vId, mId, event) => {
      // Find the current variable and its current alias if it exists
      const targetVar = modesData.variables.find(v => v.id === vId) || primitivesData.variables.find(v => v.id === vId);
      const currentAliasId = targetVar.valuesByMode[mId]?.id;
      
      currentPickerContext = { vId, mId, currentAliasId };
      
      // Position the picker near the clicked element
      const rect = event.currentTarget.getBoundingClientRect();
      const picker = document.getElementById('variable-picker');
      
      picker.style.top = `${Math.min(rect.bottom + 5, window.innerHeight - 330)}px`;
      picker.style.left = `${Math.min(rect.left, window.innerWidth - 250)}px`;
      
      pickerOverlay.style.display = 'block';
      pickerSearchInput.value = '';
      pickerSearchInput.focus();
      
      renderPickerList('');
    };

    window.hidePicker = () => {
      pickerOverlay.style.display = 'none';
      currentPickerContext = null;
    };

    window.filterPickerResults = (query) => {
      if (currentPickerContext?.type === 'family' || currentPickerContext?.type === 'weight') {
        renderFontPickerOptions(currentPickerContext.type, query);
      } else {
        renderPickerList(query);
      }
    };

    function renderPickerList(query) {
      pickerList.innerHTML = '';
      if (!currentPickerContext) return;

      const { vId, currentAliasId } = currentPickerContext;
      const targetVar = modesData.variables.find(v => v.id === vId) || primitivesData.variables.find(v => v.id === vId);
      if (!targetVar) return;

      // Group variables by collection for the picker
      const collections = [
        { name: 'Primitives', vars: primitivesData.variables },
        { name: 'Modes (Desktop / Mobile)', vars: modesData.variables }
      ];

      collections.forEach(coll => {
        const filtered = coll.vars.filter(v => {
          // Same type check
          if (v.type !== targetVar.type) return false;
          // Search query check
          if (query && !v.name.toLowerCase().includes(query.toLowerCase())) return false;
          // Prevent self-linking
          if (v.id === vId) return false;
          return true;
        });

        if (filtered.length > 0) {
          const title = document.createElement('div');
          title.className = 'picker-group-title';
          title.textContent = coll.name;
          pickerList.appendChild(title);

          filtered.forEach(v => {
            const opt = document.createElement('div');
            const isSelected = v.id === currentAliasId;
            opt.className = `picker-option ${isSelected ? 'selected' : ''}`;
            
            let typeIcon = '#';
            if (v.type === 'COLOR') typeIcon = '◐';
            if (v.type === 'STRING') typeIcon = 'T';
            if (v.type === 'BOOLEAN') typeIcon = 'B';

            opt.innerHTML = `
              <span class="type-icon">${typeIcon}</span>
              <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${v.name}</span>
              ${isSelected ? '<svg viewBox="0 0 24 24" style="width:12px;height:12px;color:var(--accent);"><path d="M20 6L9 17L4 12" stroke-width="3"></path></svg>' : ''}
            `;
            opt.onclick = () => selectPickerVariable(v.id, v.name);
            pickerList.appendChild(opt);
            
            if (isSelected && !query) {
              // Scroll to the selected item on initial load
              setTimeout(() => opt.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
            }
          });
        }
      });

      if (pickerList.innerHTML === '') {
        pickerList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted); font-size: 11px;">No matching variables found</div>';
      }
    }

    function selectPickerVariable(targetVId, targetName) {
      if (!currentPickerContext) return;
      saveToHistory();
      const { vId, mId } = currentPickerContext;

      const findAndReplace = (data) => {
        const v = data.variables.find(item => item.id === vId);
        if (v) {
          v.valuesByMode[mId] = { type: 'VARIABLE_ALIAS', id: targetVId };
          // Also update resolved name for UI
          if (!v.resolvedValuesByMode) v.resolvedValuesByMode = {};
          if (!v.resolvedValuesByMode[mId]) v.resolvedValuesByMode[mId] = {};
          v.resolvedValuesByMode[mId].aliasName = targetName;
          
          // Try to resolve the value if it exists in current data
          const sourceVar = modesData.variables.find(sv => sv.id === targetVId) || primitivesData.variables.find(sv => sv.id === targetVId);
          if (sourceVar) {
            // This is a simplified resolution, but good enough for UI preview
            const sourceVal = sourceVar.valuesByMode[Object.keys(sourceVar.valuesByMode)[0]];
            v.resolvedValuesByMode[mId].resolvedValue = sourceVal;
          }

          renderTable(data);
        }
      };

      findAndReplace(modesData);
      findAndReplace(primitivesData);
      hidePicker();
    }
