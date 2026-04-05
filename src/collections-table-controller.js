export function createCollectionsTableController({
  tableContainer,
  tokenTotal,
  getActiveGroupPath,
  getGroupChildOrder,
  getFontWeightName,
  formatFigmaWeight,
  getFontWeightNum,
  loadGoogleFont,
  onReorderVariable
}) {
  const escapeJsString = (value) => String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  const renderTable = (data) => {
    const modeKeys = Object.keys(data.modes);
    const modeNames = Object.values(data.modes);
    const activeGroupPath = getActiveGroupPath();

    const filteredVars = activeGroupPath === 'All'
      ? data.variables
      : data.variables.filter(v => v.name.startsWith(activeGroupPath + '/'));

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
    const getTypeIcon = (symbol, size = 20) => {
      return `
        <div class="type-icon" style="width:${size}px; height:${size}px; position:relative;">
          <svg viewBox="0 0 24 24" style="width:100%; height:100%; position:absolute; top:0; left:0;">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"></rect>
          </svg>
          <span style="position:relative; z-index:1; font-size:${size * 0.5}px;">${symbol}</span>
        </div>
      `;
    };

    const variableRowHtml = (v, indentLevel = 0) => {
      const parts = v.name.split('/');
      const leafName = parts[parts.length - 1];
      const normalizedLeaf = leafName.toLowerCase().replace(/[-_]/g, ' ');
      const isFontFamily = normalizedLeaf.includes('font family') || normalizedLeaf === 'family';
      const isFontWeight = normalizedLeaf.includes('font weight') || normalizedLeaf === 'weight';
      const indentPx = Math.max(0, indentLevel) * 16;

      let typeSymbol = '#';
      if (v.type === 'COLOR') typeSymbol = '◐';
      if (v.type === 'STRING') typeSymbol = 'T';
      if (v.type === 'BOOLEAN') typeSymbol = 'B';

      return `
        <tr class="variable-row" draggable="true" data-variable-id="${v.id}">
          <td onclick="focusInput('in-${v.id}')">
            <div class="cell-content" style="${indentPx > 0 ? `padding-left:${indentPx}px;` : ''}">
              <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
              ${getTypeIcon(typeSymbol)}
              <input type="text" class="table-input" id="in-${v.id}" value="${leafName}" placeholder="Variable Name" 
                onblur="updateVariableName('${v.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
            </div>
          </td>
          ${modeKeys.map(mId => {
            const val = v.valuesByMode[mId];
            const resolved = v.resolvedValuesByMode?.[mId];

            if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
              const aliasName = resolved?.aliasName || 'Unknown Alias';
              const aliasParts = aliasName.split('/');
              const displayAlias = aliasParts.length > 1
                ? `...${aliasParts[aliasParts.length - 2]}/${aliasParts[aliasParts.length - 1]}`
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
              const hex = color.r !== undefined
                ? `#${Math.round(color.r * 255).toString(16).padStart(2, '0')}${Math.round(color.g * 255).toString(16).padStart(2, '0')}${Math.round(color.b * 255).toString(16).padStart(2, '0')}`.toUpperCase()
                : (typeof val === 'string' ? val : '#000000');

              const alpha = color.a !== undefined ? color.a : 1;
              const opacityPercent = Math.round(alpha * 100);
              const swatchHtml = alpha < 1
                ? `<div class="color-swatch-picker color-swatch-split"><span class="color-swatch-solid" style="background-color: ${hex};"></span><span class="color-swatch-alpha" style="background-color: rgba(${color.r * 255},${color.g * 255},${color.b * 255},${alpha})"></span></div>`
                : `<div class="color-swatch-picker color-swatch-solid-only" style="background-color: ${hex}; background-image: none;"></div>`;
              return `
                <td>
                  <div class="cell-content">
                    <div class="color-opacity-row">
                      <button class="swatch-trigger-btn" onclick="openColorPicker('${v.id}', '${mId}', event)" aria-label="Open color picker">
                        ${swatchHtml}
                      </button>
                      <span class="themed-text color-hex-readonly">${hex.slice(1)}</span>
                      <div class="opacity-separator"></div>
                      <div class="opacity-value color-opacity-fixed" style="user-select: none;">
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

            if (isFontFamily || isFontWeight) {
              let displayVal = typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
              let currentFamily = 'sans-serif';
              let currentWeight = '400';

              if (isFontFamily) {
                currentFamily = typeof val === 'string' ? val : 'sans-serif';
              } else if (isFontWeight) {
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

                if (typeof val === 'number' || (typeof val === 'string' && /^\d+$/.test(val))) {
                  v.valuesByMode[mId] = displayVal;
                }

                const numeric = getFontWeightNum(rawWeight || 400);
                currentWeight = String(numeric);
              }

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

            const displayVal = typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
            const isNumber = v.type === 'FLOAT';
            return `
              <td onclick="focusInput('val-${v.id}-${mId}')">
                <div class="cell-content">
                  <input type="text" class="table-input" id="val-${v.id}-${mId}" value="${displayVal}" placeholder="Enter a Value"
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
    };

    const buildGroupTree = (vars) => {
      const root = { name: 'All', children: {}, vars: [] };
      vars.forEach((v) => {
        const segs = String(v.name || '').split('/');
        if (segs.length <= 1) {
          if (!root.children['Ungrouped']) root.children['Ungrouped'] = { name: 'Ungrouped', children: {}, vars: [] };
          root.children['Ungrouped'].vars.push(v);
          return;
        }
        const dirs = segs.slice(0, -1);
        let node = root;
        dirs.forEach((dir) => {
          if (!node.children[dir]) node.children[dir] = { name: dir, children: {}, vars: [] };
          node = node.children[dir];
        });
        node.vars.push(v);
      });
      return root;
    };
    const countNode = (node) => {
      let c = (node.vars ? node.vars.length : 0);
      Object.values(node.children || {}).forEach((child) => { c += countNode(child); });
      return c;
    };
    const renderGroupNode = (node, level = 0, parentPath = 'All') => {
      const childNames = Object.keys(node.children || {});
      let names = childNames.slice().sort((a, b) => a.localeCompare(b));
      if (typeof getGroupChildOrder === 'function') {
        const preferred = getGroupChildOrder(parentPath);
        if (Array.isArray(preferred) && preferred.length) {
          const preferredSet = new Set(preferred);
          names = [
            ...preferred.filter((name) => childNames.includes(name)),
            ...names.filter((name) => !preferredSet.has(name))
          ];
        }
      }
      names.forEach((name) => {
        const child = node.children[name];
        const count = countNode(child);
        const pad = 12 + level * 16;
        const isParent = level === 0;
        html += `
          <tr class="collection-group-row ${isParent ? 'group-parent' : 'group-child'}">
            <td colspan="${modeKeys.length + 2}" class="collection-group-cell">
              <div class="collection-group-inner" style="padding-left:${pad}px;">
                <span class="collection-group-name">${name}</span>
                <span class="group-count">(${count})</span>
              </div>
            </td>
          </tr>
        `;
        (child.vars || []).forEach((v) => { html += variableRowHtml(v, level + 1); });
        const childPath = parentPath === 'All' ? name : `${parentPath}/${name}`;
        renderGroupNode(child, level + 1, childPath);
      });
    };

    if (activeGroupPath === 'All') {
      const tree = buildGroupTree(filteredVars);
      renderGroupNode(tree, 0);
    } else {
      const scopedRoot = { name: activeGroupPath, children: {}, vars: [] };
      const scopedPrefix = `${activeGroupPath}/`;
      filteredVars.forEach((v) => {
        const relativeName = String(v.name || '').startsWith(scopedPrefix)
          ? String(v.name).slice(scopedPrefix.length)
          : String(v.name || '');
        const segs = relativeName.split('/');
        if (segs.length <= 1) {
          scopedRoot.vars.push(v);
          return;
        }
        const dirs = segs.slice(0, -1);
        let node = scopedRoot;
        dirs.forEach((dir) => {
          if (!node.children[dir]) node.children[dir] = { name: dir, children: {}, vars: [] };
          node = node.children[dir];
        });
        node.vars.push(v);
      });
      (scopedRoot.vars || []).forEach((v) => {
        html += variableRowHtml(v, 0);
      });
      renderGroupNode(scopedRoot, 0, activeGroupPath);
    }

    const existingTypes = new Set(filteredVars.map(v => v.type));
    const showString = existingTypes.size === 0 || existingTypes.has('STRING');
    const showColor = existingTypes.size === 0 || existingTypes.has('COLOR');
    const showFloat = existingTypes.size === 0 || existingTypes.has('FLOAT');
    const showBoolean = existingTypes.size === 0 || existingTypes.has('BOOLEAN');
    const encodedGroupPath = escapeJsString(activeGroupPath);

    html += `
        </tbody>
      </table>
      <div style="padding: 12px; display: flex; gap: 8px; border-top: 1px solid var(--border);">
        ${showString ? `<button class="add-var-btn" onclick="addVariable('STRING', '${encodedGroupPath}')" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--fg);">+ Add String</button>` : ''}
        ${showColor ? `<button class="add-var-btn" onclick="addVariable('COLOR', '${encodedGroupPath}')" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--fg);">+ Add Color</button>` : ''}
        ${showFloat ? `<button class="add-var-btn" onclick="addVariable('FLOAT', '${encodedGroupPath}')" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--fg);">+ Add Number</button>` : ''}
        ${showBoolean ? `<button class="add-var-btn" onclick="addVariable('BOOLEAN', '${encodedGroupPath}')" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--fg);">+ Add Boolean</button>` : ''}
      </div>
    `;

    tableContainer.innerHTML = html;
    const rows = Array.from(tableContainer.querySelectorAll('tbody tr.variable-row'));
    const handles = Array.from(tableContainer.querySelectorAll('tbody tr.variable-row .drag-handle'));
    let draggedId = null;
    const clearDropState = () => {
      rows.forEach((row) => {
        row.classList.remove('dragging');
        row.classList.remove('drag-over-before');
        row.classList.remove('drag-over-after');
      });
    };
    rows.forEach((row) => {
      row.draggable = false;
      row.addEventListener('dragover', (event) => {
        if (!draggedId) return;
        event.preventDefault();
        if (row.dataset.variableId === draggedId) return;
        row.classList.remove('drag-over-before');
        row.classList.remove('drag-over-after');
        const rect = row.getBoundingClientRect();
        const placeAfter = event.clientY >= rect.top + rect.height / 2;
        row.classList.add(placeAfter ? 'drag-over-after' : 'drag-over-before');
      });
      row.addEventListener('dragleave', () => {
        row.classList.remove('drag-over-before');
        row.classList.remove('drag-over-after');
      });
      row.addEventListener('drop', (event) => {
        if (!draggedId) return;
        event.preventDefault();
        const targetId = row.dataset.variableId || null;
        if (!targetId || targetId === draggedId) {
          clearDropState();
          draggedId = null;
          return;
        }
        const rect = row.getBoundingClientRect();
        const placeAfter = event.clientY >= rect.top + rect.height / 2;
        onReorderVariable(draggedId, targetId, placeAfter);
        clearDropState();
        draggedId = null;
      });
      row.addEventListener('dragend', () => {
        clearDropState();
        draggedId = null;
      });
    });
    handles.forEach((handle) => {
      handle.draggable = true;
      handle.addEventListener('dragstart', (event) => {
        const row = handle.closest('tr.variable-row');
        if (!row) {
          event.preventDefault();
          return;
        }
        draggedId = row.dataset.variableId || null;
        row.classList.add('dragging');
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', draggedId || '');
        }
      });
      handle.addEventListener('dragend', () => {
        clearDropState();
        draggedId = null;
      });
    });
  };

  return {
    renderTable
  };
}
