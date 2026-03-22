import { GOOGLE_FONTS } from "./google-fonts.js";

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
    let projectHeadingCount = 0;
    let projectBodyCount = 0;
    let activeCollection = null; // 'modes' | 'primitives'
    let activeGroupPath = 'All';
    let state = 'init';
    let collapsedGroups = new Set();

    // Undo/Redo State
    let history = [];
    let historyIndex = -1;
    const MAX_HISTORY = 50;
    let historyTimeout = null;

    function saveToHistory() {
      if (history.length === 0) {
        history.push(JSON.parse(JSON.stringify({ modesData, primitivesData, activeCollection, activeGroupPath })));
        historyIndex = 0;
      } else if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
      }
      
      if (historyTimeout) clearTimeout(historyTimeout);
      
      historyTimeout = setTimeout(() => {
        const snapshotStr = JSON.stringify({
          modesData,
          primitivesData,
          activeCollection,
          activeGroupPath
        });
        
        if (historyIndex >= 0 && JSON.stringify(history[historyIndex]) === snapshotStr) {
          historyTimeout = null;
          return;
        }

        history.push(JSON.parse(snapshotStr));
        if (history.length > MAX_HISTORY) history.shift();
        else historyIndex++;
        historyTimeout = null;
      }, 100);
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
      // Do not overwrite activeCollection and activeGroupPath
      // so the user stays on the current page when undoing/redoing
      
      renderSidebar();
      const data = activeCollection === 'modes' ? modesData : primitivesData;
      if (data) {
        viewTitle.textContent = data.name;
        renderTable(data);
      }
    }

    document.addEventListener('click', (e) => {
      const isColorModalOpen = cpModal.style.display === 'flex';
      const isVariablePickerOpen = pickerOverlay.style.display === 'block';

      if (isColorModalOpen && !cpModal.contains(e.target) && !e.target.closest('.color-opacity-row')) {
        saveToHistory();
        hideColorPicker();
      }
      
      if (isVariablePickerOpen && !pickerOverlay.querySelector('.variable-picker').contains(e.target) && !e.target.closest('.table-input') && !e.target.closest('.link-btn')) {
        hidePicker();
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        if (!isInput) {
          e.preventDefault();
          redo();
        }
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
      if (statusMsg) {
        statusMsg.textContent = text;
      }
      if (success) {
        setTimeout(() => {
          if (statusMsg) statusMsg.textContent = 'Ready';
          progressTrack.style.display = 'none';
          progressFill.style.width = '0%';
        }, 3000);
      }
    }

    actionBtn.onclick = () => {
      console.log('clicked, state:', state);
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      
      // Remove disabled check since the button is visually enabled but the property might still be preventing clicks
      
      if (state === 'init') {
        updateStatus('Fetching library data...');
        parent.postMessage({ pluginMessage: { type: 'request-token-data' } }, '*');
      } else {
        progressTrack.style.display = 'block';
        progressFill.style.width = '40%';
        updateStatus('Syncing to Figma...');
        
        parent.postMessage({ 
          pluginMessage: { 
            type: 'request-import',
            data: { modesData, primitivesData }
          } 
        }, '*');
      }
    };

    window.hideModificationsModal = () => {
      document.getElementById('modifications-modal').style.display = 'none';
    };

    window.onmessage = (event) => {
      const msg = event.data?.pluginMessage;
      if (!msg) return;
      
      if (msg.type === 'collections-status') {
        modesExist = msg.modesExist;
        primitivesExist = msg.primitivesExist;
        projectHeadingCount = msg.headingCount || 0;
        projectBodyCount = msg.bodyCount || 0;
        if (!modesData) modesData = msg.preview.modes;
        if (!primitivesData) primitivesData = msg.preview.primitives;
        
        if (!activeCollection) selectCollection('modes');
        
        // Ensure duplicate notice is hidden properly if state resets
        if (duplicateNotice) {
          duplicateNotice.style.display = 'none';
        }
        
        // Force the button to be enabled and clickable
        actionBtn.disabled = false;
        actionBtn.removeAttribute('disabled');
        
        if (modesExist && primitivesExist) {
          actionBtn.textContent = 'Load Library for Review';
        } else {
          actionBtn.textContent = 'Load Library for Review';
        }
      }

      if (msg.type === 'token-data-response') {
        console.log('[ui.js] Received token-data-response', { 
          hasModesRaw: !!msg.modesRaw, 
          hasPrimitivesRaw: !!msg.primitivesRaw 
        });

        // Parse the raw strings received from the backend to bypass IPC payload size limits
        const incomingModes = msg.modesRaw ? JSON.parse(msg.modesRaw) : msg.modes;
        const incomingPrimitives = msg.primitivesRaw ? JSON.parse(msg.primitivesRaw) : msg.primitives;
        
        console.log('[ui.js] Parsed incoming data', { 
          modesCount: incomingModes?.variables?.length, 
          primitivesCount: incomingPrimitives?.variables?.length 
        });

        // Compare current data with default library data
        const diffs = { added: [], changed: [], deleted: [] };
        const compareData = (currentData, defaultData) => {
          if (!currentData || !defaultData) return;
          currentData.variables.forEach(v => {
            const defV = defaultData.variables.find(dv => dv.id === v.id);
            if (!defV) {
              diffs.added.push(v.name);
            } else {
              if (v.name !== defV.name) {
                diffs.changed.push(`${defV.name} -> ${v.name}`);
                return;
              }
              let isChanged = false;
              for (const mId in v.valuesByMode) {
                if (JSON.stringify(v.valuesByMode[mId]) !== JSON.stringify(defV.valuesByMode[mId])) {
                  isChanged = true;
                  break;
                }
              }
              if (isChanged) diffs.changed.push(v.name);
            }
          });
          defaultData.variables.forEach(dv => {
            if (!currentData.variables.find(v => v.id === dv.id)) {
              diffs.deleted.push(dv.name);
            }
          });
        };

        if (modesData) compareData(modesData, incomingModes);
        if (primitivesData) compareData(primitivesData, incomingPrimitives);

        const totalDiffs = diffs.added.length + diffs.changed.length + diffs.deleted.length;
        const headerNotice = document.getElementById('header-changes-notice');
        const headerText = document.getElementById('header-changes-text');
        
        if (totalDiffs > 0) {
          headerNotice.style.display = 'flex';
          headerText.textContent = `${totalDiffs} modification${totalDiffs > 1 ? 's' : ''} detected`;
          
          let modalHtml = '';
          const createBox = (title, items, colorVar) => {
            if (!items.length) return '';
            return `
              <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 12px; margin-bottom: 8px;">
                <div style="color: ${colorVar}; font-weight: 600; font-size: 12px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                  <div style="width: 6px; height: 6px; border-radius: 50%; background: ${colorVar};"></div>
                  ${title} (${items.length})
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; max-height: 150px; overflow-y: auto; font-size: 11px; font-family: monospace;">
                  ${items.map((n, i) => `<div style="padding: 4px 0; ${i !== items.length - 1 ? 'border-bottom: 1px dashed var(--border);' : ''}">${n}</div>`).join('')}
                </div>
              </div>
            `;
          };

          modalHtml += createBox('Added', diffs.added, 'var(--success)');
          modalHtml += createBox('Changed', diffs.changed, 'var(--accent)');
          modalHtml += createBox('Deleted', diffs.deleted, 'var(--error)');
          
          document.getElementById('modifications-list').innerHTML = modalHtml;
          
          headerNotice.onclick = () => {
            document.getElementById('modifications-modal').style.display = 'block';
          };
        } else {
          headerNotice.style.display = 'none';
        }

        // We DO NOT overwrite user's modesData / primitivesData with incoming data here if they already exist.
        // That is what was wiping out the custom edits! We only initialize them if they are completely null.
        if (!modesData) modesData = incomingModes;
        if (!primitivesData) primitivesData = incomingPrimitives;
        
        state = 'sync';
        actionBtn.textContent = 'Sync to Variables';
        actionBtn.disabled = false;
        
        // Don't force page change, just re-render current view
        if (activeViewMode === 'collections') {
          if (!activeCollection) selectCollection('modes');
          else renderTable(activeCollection === 'modes' ? modesData : primitivesData);
          document.getElementById('table-container').style.display = 'block';
        } else {
          renderLocalStylesView();
        }
        
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
        { id: 'modes', name: 'Modes (Desktop / Mobile)', exists: modesExist, count: modesData ? modesData.variables.length : 0 },
        { id: 'primitives', name: 'Primitives', exists: primitivesExist, count: primitivesData ? primitivesData.variables.length : 0 }
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
    }

    window.addVariable = function(type, groupPath) {
      saveToHistory();
      const data = activeCollection === 'modes' ? modesData : primitivesData;
      if (!data) return;

      let baseName = groupPath === 'All' ? 'New Variable' : `${groupPath}/New Variable`;
      let newName = baseName;
      let counter = 1;
      while (data.variables.some(v => v.name === newName)) {
        newName = `${baseName} ${counter}`;
        counter++;
      }

      const newVar = {
        id: 'var_' + Date.now() + Math.floor(Math.random() * 1000),
        name: newName,
        type: type,
        valuesByMode: {}
      };

      Object.keys(data.modes).forEach(mId => {
        if (type === 'STRING') newVar.valuesByMode[mId] = "";
        else if (type === 'COLOR') newVar.valuesByMode[mId] = { r: 0, g: 0, b: 0, a: 1 };
        else if (type === 'FLOAT') newVar.valuesByMode[mId] = 0;
        else if (type === 'BOOLEAN') newVar.valuesByMode[mId] = false;
      });

      data.variables.push(newVar);
      renderTable(data);
      renderGroups();

      setTimeout(() => {
        focusInput(`in-${newVar.id}`);
      }, 50);
    };

    window.deleteVariable = function(vId) {
      if (!confirm("Are you sure you want to delete this variable?")) return;
      saveToHistory();

      const data = activeCollection === 'modes' ? modesData : primitivesData;
      if (!data) return;

      data.variables = data.variables.filter(v => v.id !== vId);
      renderTable(data);
      renderSidebar();
    };

    function renderTable(data) {
      const modeKeys = Object.keys(data.modes);
      const modeNames = Object.values(data.modes);
      
      let filteredVars = activeGroupPath === 'All' 
        ? data.variables 
        : data.variables.filter(v => v.name.startsWith(activeGroupPath + '/'));

      // Sort variables based on their first mode's value (descending for numbers, alphabetical for others)
      filteredVars = filteredVars.sort((a, b) => {
        const valA = a.valuesByMode[modeKeys[0]];
        const valB = b.valuesByMode[modeKeys[0]];
        
        let resA = valA;
        let resB = valB;

        // Resolve aliases for sorting
        if (typeof valA === 'object' && valA?.type === 'VARIABLE_ALIAS') {
          resA = a.resolvedValuesByMode?.[modeKeys[0]]?.resolvedValue;
        }
        if (typeof valB === 'object' && valB?.type === 'VARIABLE_ALIAS') {
          resB = b.resolvedValuesByMode?.[modeKeys[0]]?.resolvedValue;
        }

        // Special exception: 'heading_small' should be positioned before 'h1'
        const nameA = a.name.split('/').pop().toLowerCase();
        const nameB = b.name.split('/').pop().toLowerCase();
        
        if (nameA === 'heading_small' && nameB === 'h1') return -1;
        if (nameA === 'h1' && nameB === 'heading_small') return 1;

        const numA = parseFloat(resA);
        const numB = parseFloat(resB);

        if (!isNaN(numA) && !isNaN(numB)) {
          return numB - numA; // Descending for numbers
        }
        
        // Fallback to alphabetical name sorting if values aren't numbers
        return a.name.localeCompare(b.name);
      });

      tokenTotal.textContent = `${filteredVars.length} tokens`;

      let html = `
        <table>
          <thead>
            <tr>
              <th class="col-name">Name</th>
              ${modeNames.map(name => `<th class="col-mode">${name === 'Mode 1' ? 'Value' : name}</th>`).join('')}
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
        const isFontFamily = normalizedLeaf.includes('font family') || normalizedLeaf === 'family';
        const isFontWeight = normalizedLeaf.includes('font weight') || normalizedLeaf === 'weight';
        
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
                      <div class="alias-pill" title="${aliasName}" onclick="showLinkedVariablesModal('${aliasName}', event)">
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
                          <div class="opacity-value" style="user-select: none;">
                            ${opacityPercent}%
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
                let displayVal = typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
                
                // Helper to get family and weight context
                let currentFamily = 'sans-serif';
                let currentWeight = '400';
                
                if (isFontFamily) {
                  currentFamily = typeof val === 'string' ? val : 'sans-serif';
                } else if (isFontWeight) {
                  // Try to find sibling font family to pair with this weight
                  const parts = v.name.split('/');
                  const parentPath = parts.slice(0, -1).join('/');
                  const siblingVars = data.variables.filter(sv => sv.name.startsWith(parentPath));
                  const familyVar = siblingVars.find(sv => {
                    const leaf = sv.name.split('/').pop().toLowerCase().replace(/[-_]/g, ' ');
                    return leaf.includes('font family') || leaf === 'family';
                  });
                  if (familyVar && familyVar.valuesByMode[mId]) {
                     const fVal = familyVar.valuesByMode[mId];
                     currentFamily = typeof fVal === 'string' ? fVal : 'sans-serif';
                  }
                  
                  let rawWeight = val;
                  if (rawWeight && typeof rawWeight === 'object' && rawWeight.type === 'VARIABLE_ALIAS') {
                    rawWeight = v.resolvedValuesByMode?.[mId]?.resolvedValue;
                  }
                  
                  const weightName = getFontWeightName(rawWeight || '400');
                  displayVal = formatFigmaWeight(weightName);
                  
                  // Make sure the underlying data reflects the string format if it was previously an integer
                  if (typeof val === 'number' || (typeof val === 'string' && /^\d+$/.test(val))) {
                     v.valuesByMode[mId] = displayVal;
                  }
                  
                  const numeric = getFontWeightNum(rawWeight || 400);
                  currentWeight = String(numeric);
                }
                
                // Pre-load the font to avoid FOUT
                if (currentFamily !== 'sans-serif') {
                  loadGoogleFont(currentFamily);
                }

                return `
                  <td onclick="showFontPicker('${v.id}', '${mId}', '${isFontFamily ? 'family' : 'weight'}', event)">
                    <div class="cell-content">
                      <input type="text" class="table-input font-preview-input" id="val-${v.id}-${mId}" value="${displayVal}" readonly style="cursor: pointer; font-family: '${currentFamily}', sans-serif; font-weight: ${currentWeight};">
                      <div class="link-btn" title="Link to Variable" onclick="showPicker('${v.id}', '${mId}', event); event.stopPropagation();">
                        ${hexagonIcon}
                      </div>
                    </div>
                  </td>
                `;
              }

              // Default Text/Number input
              const displayVal = typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
              const isNumber = v.type === 'FLOAT';
              return `
                <td onclick="focusInput('val-${v.id}-${mId}')">
                  <div class="cell-content">
                    <input type="text" class="table-input" id="val-${v.id}-${mId}" value="${displayVal}" placeholder="Value"
                      onblur="updateVariableValue('${v.id}', '${mId}', this.value)" onkeydown="if(event.key==='Enter') this.blur(); ${isNumber ? `if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault(); let val=parseFloat(this.value)||0; val+=(event.key==='ArrowUp'?1:-1)*(event.shiftKey?8:1); this.value=val; updateVariableValue('${v.id}','${mId}',val);}` : ''}">
                    <div class="link-btn" title="Link to Variable" onclick="showPicker('${v.id}', '${mId}', event); event.stopPropagation();">
                      ${hexagonIcon}
                    </div>
                  </div>
                </td>
              `;
            }).join('')}
            <td class="col-empty" style="width: 1%; white-space: nowrap; padding-right: 8px;">
              <div class="delete-btn" onclick="deleteVariable('${v.id}')" title="Delete Variable" style="cursor:pointer; opacity:0.5; display:inline-flex; align-items:center; justify-content:center; padding: 4px 8px; border-radius: 4px; font-size: 14px;">✕</div>
            </td>
          </tr>
        `;
      });

      const existingTypes = new Set(filteredVars.map(v => v.type));
      const showString = existingTypes.size === 0 || existingTypes.has('STRING');
      const showColor = existingTypes.size === 0 || existingTypes.has('COLOR');
      const showFloat = existingTypes.size === 0 || existingTypes.has('FLOAT');
      const showBoolean = existingTypes.size === 0 || existingTypes.has('BOOLEAN');

      html += `
          </tbody>
        </table>
        <div style="padding: 12px; display: flex; gap: 8px; border-top: 1px solid var(--border);">
          ${showString ? `<button class="add-var-btn" onclick="addVariable('STRING', activeGroupPath)" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--fg);">+ Add String</button>` : ''}
          ${showColor ? `<button class="add-var-btn" onclick="addVariable('COLOR', activeGroupPath)" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--fg);">+ Add Color</button>` : ''}
          ${showFloat ? `<button class="add-var-btn" onclick="addVariable('FLOAT', activeGroupPath)" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--fg);">+ Add Number</button>` : ''}
          ${showBoolean ? `<button class="add-var-btn" onclick="addVariable('BOOLEAN', activeGroupPath)" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--fg);">+ Add Boolean</button>` : ''}
        </div>
      `;
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
      event.stopPropagation();
      saveToHistory();
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
          <div style="display: flex; align-items: center; width: 100%; gap: 4px; background: #333; border: 1px solid #444; border-radius: 6px; padding: 0 4px; height: 100%;">
            <input type="number" class="cp-input" style="height: 100%; font-size: 11px;" value="${Math.round(h)}" oninput="updateCPColor('h', this.value)" onkeydown="handleNumberKeydown(event, 'h')">
            <input type="number" class="cp-input" style="height: 100%; font-size: 11px;" value="${Math.round(s)}" oninput="updateCPColor('s', this.value)" onkeydown="handleNumberKeydown(event, 's')">
            <input type="number" class="cp-input" style="height: 100%; font-size: 11px;" value="${Math.round(l)}" oninput="updateCPColor('l', this.value)" onkeydown="handleNumberKeydown(event, 'l')">
            <input type="number" class="cp-input" style="height: 100%; font-size: 11px;" value="${Math.round(a*100)}" oninput="updateCPColor('a', this.value/100)" onkeydown="handleNumberKeydown(event, 'a', true)">
            <span class="cp-input-percent" style="font-size: 11px; opacity: 0.5;">%</span>
          </div>
        `;
      } else if (mode === 'RGB') {
        const rgb = hslToRgb(h, s, l);
        inputGroup.innerHTML = `
          <div style="display: flex; align-items: center; width: 100%; gap: 4px; background: #333; border: 1px solid #444; border-radius: 6px; padding: 0 4px; height: 100%;">
            <input type="number" class="cp-input" style="height: 100%; font-size: 11px;" value="${Math.round(rgb.r)}" oninput="updateCPRGB('r', this.value)" onkeydown="handleNumberKeydown(event, 'r')">
            <input type="number" class="cp-input" style="height: 100%; font-size: 11px;" value="${Math.round(rgb.g)}" oninput="updateCPRGB('g', this.value)" onkeydown="handleNumberKeydown(event, 'g')">
            <input type="number" class="cp-input" style="height: 100%; font-size: 11px;" value="${Math.round(rgb.b)}" oninput="updateCPRGB('b', this.value)" onkeydown="handleNumberKeydown(event, 'b')">
            <input type="number" class="cp-input" style="height: 100%; font-size: 11px;" value="${Math.round(a*100)}" oninput="updateCPColor('a', this.value/100)" onkeydown="handleNumberKeydown(event, 'a', true)">
            <span class="cp-input-percent" style="font-size: 11px; opacity: 0.5;">%</span>
          </div>
        `;
      } else {
        const rgb = hslToRgb(h, s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b).replace('#', '');
        inputGroup.style.background = 'transparent';
        inputGroup.style.border = 'none';
        inputGroup.innerHTML = `
          <div style="display: flex; align-items: center; width: 100%; gap: 8px; height: 100%;">
            <div style="display: flex; flex: 1; align-items: center; background: #333; border: 1px solid #444; border-radius: 6px; padding: 0 12px; height: 100%;">
              <input type="text" class="cp-input" style="flex: 1; text-align: left; border: none; font-family: monospace; font-size: 11px; height: 100%; min-width: 50px;" value="${hex.toUpperCase()}" oninput="updateCPHex(this.value)">
              
              <div style="width: 1px; height: 16px; background: #444; margin: 0 16px;"></div>
              
              <div style="display: flex; align-items: center; width: 45px; height: 100%; justify-content: flex-end;">
                <input type="number" class="cp-input" style="width: 30px; text-align: right; border: none; font-size: 11px; height: 100%; padding: 0;" value="${Math.round(a*100)}" oninput="updateCPColor('a', this.value/100)" onkeydown="handleNumberKeydown(event, 'a', true)">
                <span class="cp-input-percent" style="font-size: 11px; opacity: 0.5; padding-left: 2px;">%</span>
              </div>
            </div>
          </div>
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

    window.updateCPColor = (key, val, event = null) => {
      let num = parseFloat(val);
      if (event && event.type === 'keydown') {
        if (event.key === 'ArrowUp') num += event.shiftKey ? 10 : 1;
        if (event.key === 'ArrowDown') num -= event.shiftKey ? 10 : 1;
        event.preventDefault();
      }
      if (key === 'a') num = Math.max(0, Math.min(1, num));
      cpColor[key] = num;
      updateCPUI();
      applyCPColor();
    };

    window.handleNumberKeydown = (e, key, isAlpha = false) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        let val = parseFloat(e.target.value);
        const step = e.shiftKey ? 10 : 1;
        val += e.key === 'ArrowUp' ? step : -step;
        
        // Clamp logic
        if (isAlpha) {
          val = Math.max(0, Math.min(100, val));
        } else if (key === 'h') {
          val = Math.max(0, Math.min(360, val));
        } else if (key === 's' || key === 'l') {
          val = Math.max(0, Math.min(100, val));
        } else if (key === 'r' || key === 'g' || key === 'b') {
          val = Math.max(0, Math.min(255, val));
        }

        e.target.value = val;
        
        // Direct value update without stealing focus via re-render
        if (isAlpha) {
          cpColor[key] = val / 100;
        } else if (key === 'r' || key === 'g' || key === 'b') {
          const { h, s, l } = cpColor;
          const rgb = hslToRgb(h, s, l);
          rgb[key] = val;
          const newHsl = rgbToHsl(rgb.r/255, rgb.g/255, rgb.b/255, cpColor.a);
          cpColor.h = newHsl.h; cpColor.s = newHsl.s; cpColor.l = newHsl.l;
        } else {
          cpColor[key] = val;
        }
        
        // Update visual sliders/gradient without re-rendering inputs
        const { h, s, l, a } = cpColor;
        cpSatVal.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
        cpCursor.style.left = `${s}%`;
        cpCursor.style.top = `${100 - l}%`;
        cpHue.value = h;
        cpAlpha.value = a * 100;
        const rgb = hslToRgb(h, s, l);
        const isDark = document.body.classList.contains('dark');
        const c1 = isDark ? '#222' : '#eee';
        const c2 = isDark ? '#333' : '#fff';
        cpAlpha.style.color = `rgba(${rgb.r},${rgb.g},${rgb.b},1)`;
        cpAlpha.style.backgroundImage = `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b},0), rgba(${rgb.r},${rgb.g},${rgb.b},1)), conic-gradient(${c1} 0.25turn, ${c2} 0.25turn 0.5turn, ${c1} 0.5turn 0.75turn, ${c2} 0.75turn)`;
        
        applyCPColor();
      }
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

    window.activateEyeDropper = () => {
      if (!window.EyeDropper) {
        alert('Your browser does not support the EyeDropper API');
        return;
      }
      const eyeDropper = new EyeDropper();
      eyeDropper.open().then(result => {
        const hex = result.sRGBHex;
        updateCPHex(hex);
      }).catch(e => {
        console.error(e);
      });
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
      if (v) {
        const parts = v.name.split('/');
        if (parts.length > 1) {
          parts[parts.length - 1] = name;
          v.name = parts.join('/');
        } else {
          v.name = name;
        }
      }
    };

    window.updateVariableValue = (vId, mId, val) => {
      saveToHistory();
      const v = modesData.variables.find(item => item.id === vId) || primitivesData.variables.find(item => item.id === vId);
      if (v) {
        if (v.type === 'FLOAT') {
          const num = parseFloat(val);
          if (!isNaN(num)) v.valuesByMode[mId] = num;
        } else {
          v.valuesByMode[mId] = val;
        }
      }
    };

    // Variable Picker Logic
    let currentPickerContext = null;
    let pickerIndex = -1;
    let pickerItems = [];
    const pickerOverlay = document.getElementById('picker-overlay');
    const pickerList = document.getElementById('picker-list');
    const pickerSearchInput = document.getElementById('picker-search-input');

    // Font Picker Logic
    




    const viewToggleBtn = document.getElementById('view-toggle-btn');
    const tabCollections = document.getElementById('tab-collections');
    const tabLocalStyles = document.getElementById('tab-local-styles');
    const collectionsView = document.getElementById('collections-view');
    const localStylesView = document.getElementById('local-styles-view');
    
    let activeViewMode = 'collections';
    let activeLSNav = 'grid';
    const localStyleDraft = {
      grid: [
        { key: 'expanded', name: 'Grid/Expanded', count: '12', color: '#0080FF', opacity: '10', type: 'Stretch', width: 'Auto', margin: '156', gutter: '32' },
        { key: 'compact', name: 'Grid/Compact', count: '12', color: '#0080FF', opacity: '10', type: 'Stretch', width: 'Auto', margin: '56', gutter: '32' },
        { key: 'mobile', name: 'Grid/Mobile', count: '4', color: '#0080FF', opacity: '10', type: 'Stretch', width: 'Auto', margin: '16', gutter: '16' }
      ],
      heading: {},
      body: {}
    };

    window.switchLSNav = (navId) => {
      activeLSNav = navId;
      document.querySelectorAll('#local-styles-view .collection-item').forEach(el => el.classList.remove('active'));
      document.getElementById(`ls-nav-${navId}`).classList.add('active');
      
      const titleMap = { grid: 'Grid System', heading: 'Heading Text', body: 'Text' };
      document.getElementById('ls-view-title').textContent = titleMap[navId];
      
      renderLocalStylesView();
    };

    tabCollections.onclick = () => {
      activeViewMode = 'collections';
      tabCollections.style.background = 'var(--accent)';
      tabCollections.style.color = '#fff';
      tabCollections.style.opacity = '1';
      tabLocalStyles.style.background = 'transparent';
      tabLocalStyles.style.color = 'var(--fg)';
      tabLocalStyles.style.opacity = '0.7';
      collectionsView.style.display = 'flex';
      localStylesView.style.display = 'none';
    };

    tabLocalStyles.onclick = () => {
      activeViewMode = 'local-styles';
      tabLocalStyles.style.background = 'var(--accent)';
      tabLocalStyles.style.color = '#fff';
      tabLocalStyles.style.opacity = '1';
      tabCollections.style.background = 'transparent';
      tabCollections.style.color = 'var(--fg)';
      tabCollections.style.opacity = '0.7';
      collectionsView.style.display = 'none';
      localStylesView.style.display = 'flex';
      renderLocalStylesView();
    };

    function renderLocalStylesView() {
      const content = document.getElementById('local-styles-content');
      const importBtn = document.getElementById('ls-import-btn');
      const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      const toNumber = (value, fallback = 0) => {
        const parsed = parseFloat(String(value ?? '').replace(/[^0-9.-]/g, ''));
        return Number.isFinite(parsed) ? parsed : fallback;
      };
      const setImportButton = (label, isDisabled, onClick) => {
        importBtn.textContent = label;
        importBtn.disabled = isDisabled;
        importBtn.onclick = isDisabled ? null : onClick;
      };
      
      if (!modesData || !modesData.variables || modesData.variables.length === 0) {
        content.innerHTML = `
          <div style="padding: 60px 24px; text-align: center; color: var(--muted);">
            <svg viewBox="0 0 24 24" style="width: 32px; height: 32px; margin-bottom: 12px; opacity: 0.2; display: inline-block;"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <div style="margin-bottom: 16px;">Load library first to view available styles</div>
            <button class="btn-primary" onclick="document.getElementById('action-btn').click()" style="padding: 6px 12px;">Load Library</button>
          </div>
        `;
        setImportButton('Import to Figma', true, null);
        return;
      }

      const allVariables = [
        ...(modesData?.variables || []),
        ...(primitivesData?.variables || [])
      ];

      const getResolvedVal = (v) => {
        if (!v) return '';
        const val = v.valuesByMode[Object.keys(v.valuesByMode)[0]];
        if (typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
          const target = allVariables.find(t => t.id === val.id);
          return target ? target.valuesByMode[Object.keys(target.valuesByMode)[0]] : val.id;
        }
        return val;
      };
      const getResolvedByPath = (path) => {
        const variable = allVariables.find(v => v.name.toLowerCase() === path.toLowerCase());
        return variable ? getResolvedVal(variable) : '';
      };
      const fontFamilyDefault = String(
        getResolvedByPath('Typography/Font Family/font-family') ||
        getResolvedByPath('Typography/Font Family/sans') ||
        'Inter'
      );
      const fontPathDefault = allVariables.find(v => v.name.toLowerCase() === 'typography/font family/font-family')
        ?.name || allVariables.find(v => v.name.toLowerCase().includes('typography/font family'))
          ?.name || 'Typography/Font Family/font-family';
      const primitiveFontWeightOptions = (primitivesData?.variables || [])
        .filter(v => v.name.startsWith('Typography/Font Weight/'))
        .map(v => String(getResolvedVal(v) || v.name.split('/').pop() || '').trim())
        .filter(Boolean);
      const textCaseOptions = ['Original', 'Upper', 'Lower', 'Title', 'Small Caps'];

      const isHeadingToken = (name) => name.startsWith('Typography/Heading/');
      const isTextToken = (name) => name.startsWith('Typography/Text/') || name.startsWith('Typography/Body/');
      const headings = modesData.variables.filter(v => isHeadingToken(v.name));
      const bodyTexts = modesData.variables.filter(v => isTextToken(v.name));

      // Update sidebar counts
      document.getElementById('ls-count-heading').textContent = headings.length;
      document.getElementById('ls-count-body').textContent = bodyTexts.length;

      // Ensure sort logic for typography variables (highest number down to lowest based on first mode value)
      const sortTypography = (arr) => {
        return arr.sort((a, b) => {
          // Special exception: 'heading_small' should be positioned before 'h1'
          const nameA = a.name.split('/').pop().toLowerCase();
          const nameB = b.name.split('/').pop().toLowerCase();
          
          if (nameA === 'heading_small' && nameB === 'h1') return -1;
          if (nameA === 'h1' && nameB === 'heading_small') return 1;

          const valA = parseFloat(getResolvedVal(a)) || 0;
          const valB = parseFloat(getResolvedVal(b)) || 0;
          return valB - valA; // Descending
        });
      };

      const sortedHeadings = sortTypography(headings);
      const sortedBodyTexts = sortTypography(bodyTexts);

      const headingLineHeightMap = {
        heading_3xlarge: 100,
        heading_2xlarge: 100,
        heading_xlarge: 100,
        heading_large: 110,
        heading_medium: 110,
        heading_small: 120,
        h1: 120,
        h2: 120,
        h3: 120,
        h4: 130,
        h5: 140,
        h6: 140
      };

      const getTypographyRow = (section, variable) => {
        const rowKey = variable.id;
        if (!localStyleDraft[section][rowKey]) {
          const tokenName = variable.name.split('/').pop();
          localStyleDraft[section][rowKey] = {
            key: rowKey,
            name: tokenName,
            path: variable.name,
            fontPath: fontPathDefault,
            font: fontFamilyDefault,
            fontWeight: section === 'heading' ? 'Semi Bold' : 'Regular',
            size: String(getResolvedVal(variable) ?? ''),
            lineHeight: String(section === 'heading' ? (headingLineHeightMap[tokenName.toLowerCase()] || 120) : 140),
            lineSpacing: '0',
            case: 'Original'
          };
        } else {
          localStyleDraft[section][rowKey].font = fontFamilyDefault;
          localStyleDraft[section][rowKey].size = String(getResolvedVal(variable) ?? '');
        }
        return localStyleDraft[section][rowKey];
      };

      const createEditableCell = (section, rowKey, field, value, options = null) => {
        const hasOptions = Array.isArray(options) && options.length > 0;
        const optionsAttr = hasOptions ? ` data-ls-options='${escapeHtml(JSON.stringify(options))}'` : '';
        const editableMode = hasOptions ? 'false' : 'true';
        const extraClass = hasOptions ? ' ls-select-cell' : '';
        return `
          <td><div class="cell-content"><span class="table-input${extraClass}" contenteditable="${editableMode}" data-ls-section="${section}" data-ls-row="${rowKey}" data-ls-field="${field}"${optionsAttr}>${escapeHtml(value)}</span></div></td>
        `;
      };
      const createReadonlyCell = (value) => `
        <td><div class="cell-content"><span class="table-input">${escapeHtml(value)}</span></div></td>
      `;
      const createLinkedTokenCell = (path, label = path) => `
        <td class="ls-token-cell">
          <div class="cell-content">
            <div class="alias-pill" title="${escapeHtml(path)}" onclick="showLinkedVariablesModal('${escapeHtml(path)}', event)">
              <span class="type-icon">
                <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; opacity: 0.75;">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
                  <text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor" font-family="Inter, sans-serif">#</text>
                </svg>
              </span>
              <span class="alias-name">${escapeHtml(label)}</span>
            </div>
            <span class="link-btn" title="Connected" onclick="showLinkedVariablesModal('${escapeHtml(path)}', event)">
              <svg viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M18.84 15.16l1.16-1.16a5 5 0 0 0-7.07-7.07l-1.16 1.16M14 11l-4 4M5.16 8.84L4 10a5 5 0 0 0 7.07 7.07l1.16-1.16M2 2l20 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></path></svg>
            </span>
          </div>
        </td>
      `;

      const createGridRow = (row) => `
        <tr>
          ${createReadonlyCell(row.name)}
          ${createEditableCell('grid', row.key, 'count', row.count)}
          ${createEditableCell('grid', row.key, 'color', row.color)}
          ${createEditableCell('grid', row.key, 'opacity', row.opacity)}
          ${createEditableCell('grid', row.key, 'type', row.type)}
          ${createEditableCell('grid', row.key, 'width', row.width)}
          ${createEditableCell('grid', row.key, 'margin', row.margin)}
          ${createEditableCell('grid', row.key, 'gutter', row.gutter)}
        </tr>
      `;
      const createTypographyRowHtml = (section, row) => `
        <tr>
          ${createReadonlyCell(row.name)}
          ${createLinkedTokenCell(row.path)}
          ${createLinkedTokenCell(row.fontPath, row.font)}
          ${createEditableCell(section, row.key, 'fontWeight', row.fontWeight, primitiveFontWeightOptions)}
          ${createLinkedTokenCell(row.path, row.size)}
          ${createEditableCell(section, row.key, 'lineHeight', row.lineHeight)}
          ${createEditableCell(section, row.key, 'lineSpacing', row.lineSpacing)}
          ${createEditableCell(section, row.key, 'case', row.case, textCaseOptions)}
        </tr>
      `;
      const bindEditors = () => {
        const persistValue = (editableEl, overrideValue = null) => {
          const section = editableEl.dataset.lsSection;
          const rowKey = editableEl.dataset.lsRow;
          const field = editableEl.dataset.lsField;
          const value = (overrideValue ?? editableEl.textContent).trim();
          if (!section || !rowKey || !field) return;
          if (section === 'grid') {
            const targetRow = localStyleDraft.grid.find(row => row.key === rowKey);
            if (!targetRow) return;
            targetRow[field] = value;
            return;
          }
          if (!localStyleDraft[section][rowKey]) return;
          localStyleDraft[section][rowKey][field] = value;
        };
        content.querySelectorAll('[data-ls-field]').forEach((editableEl) => {
          const options = editableEl.dataset.lsOptions ? JSON.parse(editableEl.dataset.lsOptions) : null;
          if (Array.isArray(options) && options.length > 0) {
            editableEl.addEventListener('click', () => {
              const current = editableEl.textContent.trim().toLowerCase();
              const currentIndex = options.findIndex(option => String(option).toLowerCase() === current);
              const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % options.length : 0;
              const nextValue = String(options[nextIndex]);
              editableEl.textContent = nextValue;
              persistValue(editableEl, nextValue);
            });
            return;
          }
          editableEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              editableEl.blur();
            }
          });
          editableEl.addEventListener('blur', () => {
            persistValue(editableEl);
          });
        });
      };

      let tableHtml = '';

      if (activeLSNav === 'grid') {
        const theadHtml = `
          <thead>
            <tr>
              <th class="col-lg">Name</th>
              <th class="col-xs">Count</th>
              <th class="col-sm">Color</th>
              <th class="col-xs">Opacity</th>
              <th class="col-sm">Type</th>
              <th class="col-xs">Width</th>
              <th class="col-xs">Margin</th>
              <th class="col-xs">Gutter</th>
            </tr>
          </thead>
        `;
        tableHtml = `
          <table>
            ${theadHtml}
            <tbody>
              ${localStyleDraft.grid.map(row => createGridRow(row)).join('')}
            </tbody>
          </table>
        `;
        setImportButton('Import Grid Styles', localStyleDraft.grid.length === 0, () => {
          const rows = localStyleDraft.grid.map(row => ({
            name: row.name,
            count: Math.max(1, Math.round(toNumber(row.count, 12))),
            color: row.color || '#0080FF',
            opacity: Math.min(100, Math.max(0, toNumber(row.opacity, 10))),
            type: row.type || 'Stretch',
            width: row.width || 'Auto',
            margin: Math.max(0, toNumber(row.margin, 0)),
            gutter: Math.max(0, toNumber(row.gutter, 0))
          }));
          parent.postMessage({ pluginMessage: { type: 'create-grid-style', data: { rows } } }, '*');
        });
      } else if (activeLSNav === 'heading') {
        const theadHtml = `
          <thead>
            <tr>
              <th class="col-md">Name</th>
              <th class="col-lg">Linked Token</th>
              <th class="col-md">Font</th>
              <th class="col-sm">Font Weight</th>
              <th class="col-xs">Size</th>
              <th class="col-xs">Line Height</th>
              <th class="col-xs">Line Spacing</th>
              <th class="col-xs">Case</th>
            </tr>
          </thead>
        `;
        if (headings.length > 0) {
          const rows = sortedHeadings.map(h => getTypographyRow('heading', h));
          tableHtml = `
            <table>
              ${theadHtml}
              <tbody>
                ${rows.map(row => createTypographyRowHtml('heading', row)).join('')}
              </tbody>
            </table>
          `;
          setImportButton('Import Heading Styles', rows.length === 0, () => {
            parent.postMessage({ pluginMessage: { type: 'create-text-styles', data: { section: 'heading', rows } } }, '*');
          });
        } else {
          tableHtml = `
            <div style="padding: 60px 24px; text-align: center; color: var(--muted);">
              <div style="margin-bottom: 16px;">No heading variables detected.</div>
            </div>
          `;
          setImportButton('Import Heading Styles', true, null);
        }
      } else if (activeLSNav === 'body') {
        const theadHtml = `
          <thead>
            <tr>
              <th class="col-md">Name</th>
              <th class="col-lg">Linked Token</th>
              <th class="col-md">Font</th>
              <th class="col-sm">Font Weight</th>
              <th class="col-xs">Size</th>
              <th class="col-xs">Line Height</th>
              <th class="col-xs">Line Spacing</th>
              <th class="col-xs">Case</th>
            </tr>
          </thead>
        `;
        if (bodyTexts.length > 0) {
          const rows = sortedBodyTexts.map(b => getTypographyRow('body', b));
          tableHtml = `
            <table>
              ${theadHtml}
              <tbody>
                ${rows.map(row => createTypographyRowHtml('body', row)).join('')}
              </tbody>
            </table>
          `;
          setImportButton('Import Text Styles', rows.length === 0, () => {
            parent.postMessage({ pluginMessage: { type: 'create-text-styles', data: { section: 'body', rows } } }, '*');
          });
        } else {
          tableHtml = `
            <div style="padding: 60px 24px; text-align: center; color: var(--muted);">
              <div style="margin-bottom: 16px;">No body variables detected.</div>
            </div>
          `;
          setImportButton('Import Text Styles', true, null);
        }
      }

      content.innerHTML = tableHtml;
      bindEditors();
    }

    // Remove old listeners since they are dynamically bound in renderLocalStylesView now
    const fontLoader = {
      loaded: new Set(),
      queue: new Map(),
      timeout: null,
      observer: null,
      init() {
        if (this.observer) return;
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              this.load(el.dataset.family, el.dataset.weight, el.dataset.style);
              this.observer.unobserve(el);
            }
          });
        }, { root: document.getElementById('picker-list'), rootMargin: '500px' });
      },
      observe(el) {
        if (!this.observer) this.init();
        this.observer.observe(el);
      },
      load(family, weight = '400', style = 'normal') {
        if (!family) return;
        const key = `${family}:${weight}:${style}`;
        if (this.loaded.has(key)) return;
        if (!this.queue.has(family)) this.queue.set(family, new Set());
        this.queue.get(family).add(`${weight}:${style}`);
        this.loaded.add(key);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.flush(), 50);
      },
      flush() {
        if (this.queue.size === 0) return;
        const families = Array.from(this.queue.keys());
        const batch = families.slice(0, 20);
        const queries = batch.map(family => {
          const specs = Array.from(this.queue.get(family));
          const parsed = specs.map(spec => {
            const [w, s] = spec.split(':');
            return { w, ital: s === 'italic' ? 1 : 0 };
          });
          const italNeeded = parsed.some(p => p.ital === 1);
          if (italNeeded) {
            const variantList = Array.from(new Set(parsed.map(p => `${p.ital},${p.w}`)))
              .sort()
              .join(';');
            return `family=${family.replace(/ /g, '+')}:ital,wght@${variantList}`;
          } else {
            const weights = Array.from(new Set(parsed.map(p => p.w))).sort().join(';');
            return `family=${family.replace(/ /g, '+')}:wght@${weights}`;
          }
        });
        const url = `https://fonts.googleapis.com/css2?${queries.join('&')}&display=swap`;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
        batch.forEach(f => this.queue.delete(f));
        if (this.queue.size > 0) this.timeout = setTimeout(() => this.flush(), 50);
      }
    };

    // Ensure a font is actually loaded for accurate preview
    function ensureFontLoaded(family, weight = 400, style = 'normal') {
      if (!('fonts' in document)) return Promise.resolve();
      const desc = `${style === 'italic' ? 'italic ' : ''}${weight} 16px "${family}"`;
      return document.fonts.load(desc).catch(() => {});
    }

    // Prefetch a visible chunk of families with a safe base weight
    function prefetchFamilies(families) {
      if (!families.length) return;
      const chunkSize = 10;
      for (let i = 0; i < families.length; i += chunkSize) {
        const chunk = families.slice(i, i + chunkSize);
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${chunk
          .map(f => `family=${f.family.replace(/ /g, '+')}:wght@400`)
          .join('&')}&display=swap`;
        document.head.appendChild(link);
      }
    }

    // Optional: load catalog from Google Web Fonts API if a key is present
    function getFonts() {
      return GOOGLE_FONTS;
    }

    const WEIGHT_MAP = {
      'Thin': 100, 'ExtraLight': 200, 'Light': 300, 'Regular': 400,
      'Medium': 500, 'SemiBold': 600, 'Bold': 700, 'ExtraBold': 800, 'Black': 900
    };

    function getFontWeightNum(name) {
      const base = String(name).replace(/Italic/i, '').replace(/\s+/g, '').trim() || 'Regular';
      return WEIGHT_MAP[base] || parseInt(name) || 400;
    }

    function getFontWeightName(numOrName) {
      const strVal = String(numOrName).trim();
      const numMatch = strVal.match(/^(\d+)(italic)?$/i);
      if (numMatch) {
        const num = parseInt(numMatch[1]);
        const isItalic = !!numMatch[2];
        let baseName = 'Regular';
        for (const [name, value] of Object.entries(WEIGHT_MAP)) {
          if (value === num) {
            baseName = name;
            break;
          }
        }
        return isItalic ? baseName + 'Italic' : baseName;
      }
      return strVal.replace(/\s+/g, '');
    }

    function formatFigmaWeight(weight) {
      // Keep it exactly as it is, no spaces injected
      return weight.replace(/\s+/g, '');
    }

    function unformatFigmaWeight(weight) {
      return weight.replace(/\s+/g, '');
    }

    function mapVariantToName(variant) {
      const wMap = { '100':'Thin','200':'ExtraLight','300':'Light','400':'Regular','500':'Medium','600':'SemiBold','700':'Bold','800':'ExtraBold','900':'Black' };
      if (variant === 'regular') return 'Regular';
      if (variant === 'italic') return 'Italic';
      const m = variant.match(/^([0-9]{3})(italic)?$/);
      if (m) {
        const base = wMap[m[1]] || 'Regular';
        return m[2] ? base + 'Italic' : base;
      }
      return 'Regular';
    }
    let catalogLoading = false;
    async function ensureGoogleCatalogLoaded() {
      // Disabled: using GOOGLE_FONTS as source of truth
    }

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
      
      ensureGoogleCatalogLoaded();
      renderFontPickerOptions(type, '');
    };

    window.filterPickerResults = (query) => {
      if (currentPickerContext?.type === 'family' || currentPickerContext?.type === 'weight') {
        renderFontPickerOptions(currentPickerContext.type, query);
      } else {
        renderPickerList(query);
      }
      pickerItems = Array.from(pickerList.querySelectorAll('.picker-option, .font-picker-item'));
      pickerIndex = pickerItems.length ? 0 : -1;
      updatePickerActive();
    };

    pickerSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        movePicker(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        movePicker(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (pickerItems[pickerIndex]) {
          pickerItems[pickerIndex].click();
        }
      }
    });

    const loadedFonts = new Set();
    function loadGoogleFont(fontFamily) {
      if (!fontFamily || loadedFonts.has(fontFamily)) return;
      loadedFonts.add(fontFamily);
      const font = getFonts().find(f => f.family === fontFamily);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      if (font && font.weights) {
        const weights = font.weights.map(w => getFontWeightNum(w)).join(';');
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}:wght@${weights}&display=swap`;
      } else {
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;700&display=swap`;
      }
      document.head.appendChild(link);
    }

    function renderFontPickerOptions(type, query = '') {
      pickerList.innerHTML = '';
      const { vId, mId } = currentPickerContext;
      const data = activeCollection === 'modes' ? modesData : primitivesData;
      const currentVar = data.variables.find(v => v.id === vId);

      if (type === 'family') {
        const filtered = getFonts().filter(f => f.family.toLowerCase().includes(query.toLowerCase()));
        const EAGER_COUNT = 30;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            observer.unobserve(el);
            const family = el.dataset.family;
            const weights = el.__fontWeights || [];
            const nameEl = el.querySelector('.font-name');
            loadGoogleFont(family);
            if (nameEl) {
              nameEl.style.setProperty('font-family', `"${family}", sans-serif`, 'important');
              nameEl.style.fontWeight = '400';
              nameEl.style.fontStyle = 'normal';
              if ('fonts' in document) {
                document.fonts.load(`400 14px "${family}"`).then(() => {
                  nameEl.style.opacity = '1';
                }).catch(() => {
                  nameEl.style.opacity = '0.5';
                });
              } else {
                nameEl.style.opacity = '1';
              }
            }
          });
        }, { root: pickerList, rootMargin: '500px' });
        filtered.forEach((font, idx) => {
          const opt = document.createElement('div');
          opt.className = 'font-picker-item';
          opt.dataset.family = font.family;
          opt.dataset.weight = '400';
          opt.dataset.style = 'normal';
          const nameSpan = document.createElement('span');
          nameSpan.className = 'font-name';
          nameSpan.textContent = font.family;
          nameSpan.style.opacity = '0';
          opt.appendChild(nameSpan);
          opt.__fontWeights = font.weights;
          if (idx < EAGER_COUNT) {
            loadGoogleFont(font.family);
            nameSpan.style.setProperty('font-family', `"${font.family}", sans-serif`, 'important');
            nameSpan.style.fontWeight = '400';
            nameSpan.style.fontStyle = 'normal';
            if ('fonts' in document) {
              document.fonts.load(`400 14px "${font.family}"`).then(() => {
                nameSpan.style.opacity = '1';
              }).catch(() => {
                nameSpan.style.opacity = '0.5';
              });
            } else {
              nameSpan.style.opacity = '1';
            }
          } else {
            observer.observe(opt);
          }
          
          opt.onclick = () => {
            updateVariableValue(vId, mId, font.family);
            renderWeightOptions(data, currentVar, mId, '');
            syncSiblingWeight(data, currentVar, mId, font, null);
            hidePicker();
            renderTable(data);
          };
          pickerList.appendChild(opt);
        });
      } else {
        renderWeightOptions(data, currentVar, mId, query);
      }
      
      pickerItems = Array.from(pickerList.querySelectorAll('.font-picker-item'));
      pickerIndex = pickerItems.length ? 0 : -1;
      updatePickerActive();
    }

    function syncSiblingWeight(data, currentVar, mId, font, preferredWeight) {
      const parts = currentVar.name.split('/');
      // The current variable is typically "Typography/Font Family", so its base is "Typography"
      const basePath = parts.slice(0, -1).join('/');
      
      // Look for the actual "Font Weight" folder next to the "Font Family" folder
      // Since `currentVar.name` might be `Typography/Font Family`, we need the root of that group
      const parentPath = parts.slice(0, -2).join('/');
      const isTopLevel = parts.length <= 2;
      const searchPath = isTopLevel ? basePath : parentPath;
      
      const siblingVars = data.variables.filter(sv => sv.name.startsWith(searchPath));
      
      // Find all existing weight variables in the parallel "Font Weight" folder or as siblings
      const weightVars = siblingVars.filter(sv => {
        const lowerName = sv.name.toLowerCase();
        return lowerName.includes('font weight') || lowerName.includes('/weight');
      });
      
      // Attempt to find the exact folder path used by the existing weight variables
      let targetWeightFolder = `${searchPath ? searchPath + '/' : ''}Font Weight`;
      if (weightVars.length > 0) {
        // use the directory path of the first found weight variable
        const wParts = weightVars[0].name.split('/');
        targetWeightFolder = wParts.slice(0, -1).join('/');
      } else {
         // fallback if none exist
         targetWeightFolder = `${basePath}/Font Weight`;
      }
      
      // Remove them
      weightVars.forEach(wv => {
        data.variables = data.variables.filter(v => v.id !== wv.id);
      });
      
      // Create new font weight variables based on the font's available weights
      if (font && font.weights) {
        font.weights.forEach(weight => {
          const figmaValue = formatFigmaWeight(weight);
          const varName = figmaValue.toLowerCase().replace(/\s+/g, ' ');
          const newVar = {
            id: 'var-' + Math.random().toString(36).substr(2, 9),
            name: `${targetWeightFolder}/${varName}`,
            type: 'STRING',
            valuesByMode: {}
          };
          
          // Set the value for all available modes
          const modes = Object.keys(data.variables[0]?.valuesByMode || { [mId]: true });
          modes.forEach(modeId => {
            newVar.valuesByMode[modeId] = figmaValue;
          });
          
          data.variables.push(newVar);
        });
      }
      
      // Force the sidebar to re-render to update the token counts immediately
      renderSidebar();
    }

    function renderWeightOptions(data, currentVar, mId, query) {
      pickerList.innerHTML = '';
      // Find the sibling font family variable
      const parts = currentVar.name.split('/');
      const parentPath = parts.slice(0, -2).join('/');
      const basePath = parts.slice(0, -1).join('/');
      const isTopLevel = parts.length <= 2;
      const searchPath = isTopLevel ? basePath : parentPath;
      
      const siblingVars = data.variables.filter(sv => sv.name.startsWith(searchPath));
      const familyVar = siblingVars.find(sv => {
        const leaf = sv.name.split('/').pop().toLowerCase().replace(/[-_]/g, ' ');
        return leaf.includes('font family') || leaf === 'family';
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

      const font = getFonts().find(f => f.family === currentFamily);
      if (!font) return;
      
      const linkId = 'google-fonts-weights-preview';
        let link = document.getElementById(linkId);
        if (!link) {
          link = document.createElement('link');
          link.id = linkId;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
        const variantPairs = font.weights.map(w => {
          const isItalic = w.toLowerCase().includes('italic');
          const weight = getFontWeightNum(w);
          return `${isItalic ? 1 : 0},${weight}`;
        });
        const unique = Array.from(new Set(variantPairs)).sort().join(';');
        link.href = `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:ital,wght@${unique}&display=swap`;

        const filteredWeights = font.weights.filter(w => w.toLowerCase().includes(query.toLowerCase()) || formatFigmaWeight(w).toLowerCase().includes(query.toLowerCase()));
        filteredWeights.forEach(weight => {
          const opt = document.createElement('div');
          opt.className = 'font-picker-item';
          const isItalic = weight.toLowerCase().includes('italic');
          const fontWeightNum = getFontWeightNum(weight);
          const figmaWeight = formatFigmaWeight(weight);
          const style = isItalic ? 'italic' : 'normal';
          const nameEl = document.createElement('span');
          nameEl.className = 'font-name';
          nameEl.textContent = figmaWeight;
          nameEl.style.opacity = '0';
          opt.appendChild(nameEl);
          loadGoogleFont(font.family);
          nameEl.style.setProperty('font-family', `"${font.family}", sans-serif`, 'important');
          nameEl.style.fontWeight = String(fontWeightNum);
          nameEl.style.fontStyle = style;
          if ('fonts' in document) {
            const desc = `${isItalic ? 'italic ' : ''}${fontWeightNum} 14px "${font.family}"`;
            document.fonts.load(desc).then(() => {
              nameEl.style.opacity = '1';
            }).catch(() => {
              nameEl.style.opacity = '0.5';
            });
          } else {
            nameEl.style.opacity = '1';
          }
          opt.onclick = () => {
            updateVariableValue(currentVar.id, mId, figmaWeight);
            hidePicker();
            renderTable(data);
          };
          pickerList.appendChild(opt);
        });
      
      pickerItems = Array.from(pickerList.querySelectorAll('.font-picker-item'));
      pickerIndex = pickerItems.length ? 0 : -1;
      updatePickerActive();
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
      pickerSearchInput.disabled = false;
      pickerSearchInput.placeholder = 'Search';
      document.getElementById('picker-title').textContent = 'Linked Variables';
      pickerSearchInput.focus();
      
      renderPickerList('');
    };

    window.hidePicker = () => {
      pickerOverlay.style.display = 'none';
      currentPickerContext = null;
      pickerSearchInput.disabled = false;
      pickerSearchInput.placeholder = 'Search';
      document.getElementById('picker-title').textContent = 'Google Fonts';
    };

    function updatePickerActive() {
      pickerItems.forEach((el, i) => {
        el.classList.toggle('active', i === pickerIndex);
        if (i === pickerIndex) {
          el.style.backgroundColor = 'var(--accent-soft)';
          el.style.color = 'var(--accent)';
        } else {
          el.style.backgroundColor = '';
          el.style.color = '';
        }
      });
      if (pickerItems[pickerIndex]) {
        pickerItems[pickerIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    function movePicker(dir) {
      if (!pickerItems.length) return;
      pickerIndex = (pickerIndex + dir + pickerItems.length) % pickerItems.length;
      updatePickerActive();
    }

    function escapePickerHtml(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function getAllVariables() {
      return [
        ...(modesData?.variables || []),
        ...(primitivesData?.variables || [])
      ];
    }

    function resolveVariableValue(variable) {
      if (!variable) return '';
      const modeIds = Object.keys(variable.valuesByMode || {});
      if (modeIds.length === 0) return '';
      const val = variable.valuesByMode[modeIds[0]];
      if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
        const source = getAllVariables().find(v => v.id === val.id);
        if (!source) return '';
        return resolveVariableValue(source);
      }
      return val;
    }

    function getRelatedVariables(path) {
      const normalized = String(path || '').trim().toLowerCase();
      const all = getAllVariables();
      const target = all.find(v => v.name.toLowerCase() === normalized);
      if (!target) return [];
      const lastSlash = target.name.lastIndexOf('/');
      const basePath = lastSlash > -1 ? target.name.slice(0, lastSlash) : '';
      return all
        .filter(v => v.type === target.type && (basePath ? v.name.startsWith(`${basePath}/`) : !v.name.includes('/')))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    function getPickerValue(variable) {
      const resolved = resolveVariableValue(variable);
      if (typeof resolved === 'number') return String(Math.round(resolved * 100) / 100);
      if (typeof resolved === 'string') return resolved;
      if (resolved === null || resolved === undefined) return '';
      return JSON.stringify(resolved);
    }

    window.renderLinkedPreviewList = (query) => {
      if (!currentPickerContext || currentPickerContext.type !== 'linked-preview') return;
      const search = String(query || '').toLowerCase();
      const list = (currentPickerContext.linkedCandidates || []).filter(v =>
        !search || v.name.toLowerCase().includes(search)
      );
      pickerList.innerHTML = '';
      if (list.length === 0) {
        pickerList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted); font-size: 11px;">No matching variables found</div>';
        pickerItems = [];
        pickerIndex = -1;
        return;
      }
      const groupName = currentPickerContext.baseLabel || 'Related Variables';
      const title = document.createElement('div');
      title.className = 'picker-group-title';
      title.textContent = groupName;
      pickerList.appendChild(title);
      list.forEach(v => {
        const opt = document.createElement('div');
        const isSelected = v.name.toLowerCase() === String(currentPickerContext.linkedPath || '').toLowerCase();
        opt.className = `picker-option ${isSelected ? 'selected' : ''}`;
        const typeIcon = `
          <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; opacity: 0.8;">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
            <text x="12" y="16" text-anchor="middle" font-size="12" fill="currentColor" font-family="Inter, sans-serif">#</text>
          </svg>
        `;
        const valueLabel = v.type === 'FLOAT' ? getPickerValue(v) : '';
        opt.innerHTML = `
          <span class="type-icon">${typeIcon}</span>
          <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapePickerHtml(v.name.split('/').pop() || v.name)}</span>
          ${valueLabel ? `<span class="linked-row-value">${escapePickerHtml(valueLabel)}</span>` : ''}
        `;
        opt.onclick = () => {
          currentPickerContext.linkedPath = v.name;
          window.renderLinkedPreviewList(pickerSearchInput.value);
        };
        pickerList.appendChild(opt);
      });
      pickerItems = Array.from(pickerList.querySelectorAll('.picker-option'));
      pickerIndex = -1;
      updatePickerActive();
    };

    window.showLinkedVariablesModal = (path, event) => {
      if (event) event.stopPropagation();
      const rect = event?.currentTarget?.getBoundingClientRect();
      const normalizedPath = String(path || '').trim();
      const related = getRelatedVariables(normalizedPath);
      const all = getAllVariables();
      const selected = all.find(v => v.name.toLowerCase() === normalizedPath.toLowerCase());
      const baseLabel = selected?.name.includes('/') ? selected.name.split('/').slice(0, -1).join('/') : 'Related Variables';
      currentPickerContext = {
        type: 'linked-preview',
        linkedPath: normalizedPath,
        linkedCandidates: related.length > 0 ? related : all.filter(v => v.name.toLowerCase() === normalizedPath.toLowerCase()),
        baseLabel
      };
      document.getElementById('picker-title').textContent = 'Linked Variables';
      pickerSearchInput.value = '';
      pickerSearchInput.disabled = false;
      pickerSearchInput.placeholder = 'Search';
      pickerOverlay.style.display = 'block';
      pickerSearchInput.focus();
      const picker = document.getElementById('variable-picker');
      picker.style.top = `${Math.min((rect?.bottom || 80) + 6, window.innerHeight - 330)}px`;
      picker.style.left = `${Math.min(rect?.left || 24, window.innerWidth - 250)}px`;
      window.renderLinkedPreviewList('');
    };

    window.filterPickerResults = (query) => {
      if (currentPickerContext?.type === 'family' || currentPickerContext?.type === 'weight') {
        renderFontPickerOptions(currentPickerContext.type, query);
      } else if (currentPickerContext?.type === 'linked-preview') {
        window.renderLinkedPreviewList(query);
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
      const getPickerValue = (variable) => {
        const raw = variable.valuesByMode[Object.keys(variable.valuesByMode)[0]];
        if (typeof raw === 'number') return String(Math.round(raw * 100) / 100);
        if (typeof raw === 'string') return raw;
        if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
          const source = modesData.variables.find(sv => sv.id === raw.id) || primitivesData.variables.find(sv => sv.id === raw.id);
          if (!source) return '';
          const sourceRaw = source.valuesByMode[Object.keys(source.valuesByMode)[0]];
          return typeof sourceRaw === 'number' ? String(Math.round(sourceRaw * 100) / 100) : String(sourceRaw ?? '');
        }
        return '';
      };

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
            const typeIcon = `
              <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; opacity: 0.8;">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
                <text x="12" y="16" text-anchor="middle" font-size="12" fill="currentColor" font-family="Inter, sans-serif">#</text>
              </svg>
            `;
            const valueLabel = v.type === 'FLOAT' ? getPickerValue(v) : '';

            opt.innerHTML = `
              <span class="type-icon">${typeIcon}</span>
              <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${v.name.split('/').pop() || v.name}</span>
              ${valueLabel ? `<span class="linked-row-value">${valueLabel}</span>` : ''}
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
      
      pickerItems = Array.from(pickerList.querySelectorAll('.picker-option'));
      pickerIndex = -1;
      updatePickerActive();
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
  
