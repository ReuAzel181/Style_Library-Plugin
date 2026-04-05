export function createLocalStylesController({ openLocalOptionPicker, onPrimaryActionChange }) {
  const localStyleDraft = {
    grid: [
      { key: 'expanded', name: 'Grid/Expanded', count: '12', color: '#0080FF', opacity: '10', type: 'Stretch', width: 'Auto', margin: '156', gutter: '32' },
      { key: 'compact', name: 'Grid/Compact', count: '12', color: '#0080FF', opacity: '10', type: 'Stretch', width: 'Auto', margin: '56', gutter: '32' },
      { key: 'mobile', name: 'Grid/Mobile', count: '4', color: '#0080FF', opacity: '10', type: 'Stretch', width: 'Auto', margin: '16', gutter: '16' }
    ],
    heading: {},
    body: {}
  };
  const localStyleUnits = {
    heading: { lineHeightPercent: true, lineSpacingPercent: true },
    body: { lineHeightPercent: true, lineSpacingPercent: true }
  };
  const LOCAL_STYLE_TITLE_MAP = { grid: 'Grid System', heading: 'Heading Text', body: 'Text' };
  let activeLSNav = 'grid';
  let fontWeightPathByValue = {};

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
  const updateNavUi = () => {
    document.querySelectorAll('#local-styles-view .collection-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`ls-nav-${activeLSNav}`)?.classList.add('active');
    document.getElementById('ls-view-title').textContent = LOCAL_STYLE_TITLE_MAP[activeLSNav] || LOCAL_STYLE_TITLE_MAP.grid;
  };

  const render = ({ modesData, primitivesData }) => {
    const content = document.getElementById('local-styles-content');
    const setImportButton = (label, isDisabled, onClick) => {
      if (typeof onPrimaryActionChange === 'function') {
        onPrimaryActionChange({
          label,
          disabled: isDisabled,
          onClick: isDisabled ? null : onClick
        });
      }
    };

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
    const findByPathCandidates = (paths) => {
      const lowerPaths = paths.map(path => String(path || '').toLowerCase());
      return allVariables.find(v => lowerPaths.includes(v.name.toLowerCase())) || null;
    };
    const fontFamilyDefault = String(
      getResolvedByPath('Typography/Font Family/font-family') ||
      getResolvedByPath('Typography/Font Family/sans') ||
      'Inter'
    );
    const fontPathDefault = allVariables.find(v => v.name.toLowerCase() === 'typography/font family/font-family')
      ?.name || allVariables.find(v => v.name.toLowerCase().includes('typography/font family'))
        ?.name || 'Typography/Font Family/font-family';
    const primitiveTypographyFontWeightVariables = (primitivesData?.variables || [])
      .filter(v => String(v.name || '').toLowerCase().startsWith('typography/font weight/'));
    const typographyFontWeightVariables = primitiveTypographyFontWeightVariables.length > 0
      ? primitiveTypographyFontWeightVariables
      : allVariables.filter(v => String(v.name || '').toLowerCase().startsWith('typography/font weight/'));
    fontWeightPathByValue = {};
    const primitiveFontWeightOptions = typographyFontWeightVariables
      .map(v => {
        const label = String(getResolvedVal(v) || v.name.split('/').pop() || '').trim();
        if (!label) return '';
        const optionKey = label.toLowerCase().replace(/\s+/g, ' ');
        if (!fontWeightPathByValue[optionKey]) {
          fontWeightPathByValue[optionKey] = v.name;
        }
        return label;
      })
      .filter(Boolean);
    const getFontWeightDefault = (section) => {
      const fallbackCandidates = section === 'heading'
        ? ['Typography/Font Weight/semibold', 'Typography/Font Weight/semi bold', 'Typography/Font Weight/regular']
        : ['Typography/Font Weight/regular', 'Typography/Font Weight/medium', 'Typography/Font Weight/semibold'];
      const matchedVariable = findByPathCandidates(fallbackCandidates);
      const path = matchedVariable?.name || fallbackCandidates[0];
      const resolved = String(matchedVariable ? getResolvedVal(matchedVariable) : '').trim();
      if (resolved) {
        return { path, value: resolved };
      }
      if (section === 'heading') {
        return { path, value: 'Semi Bold' };
      }
      return { path, value: 'Regular' };
    };
    const textCaseOptions = ['Original', 'Upper', 'Lower', 'Title', 'Small Caps'];
    const formatUnitValue = (value, isPercent) => {
      const normalized = String(value ?? '').replace('%', '').trim();
      if (!normalized) return '';
      return isPercent ? `${normalized}%` : normalized;
    };
    const isHeadingToken = (name) => name.startsWith('Typography/Heading/');
    const isTextToken = (name) => name.startsWith('Typography/Text/') || name.startsWith('Typography/Body/');
    const headings = modesData.variables.filter(v => isHeadingToken(v.name));
    const bodyTexts = modesData.variables.filter(v => isTextToken(v.name));
    const headingNav = document.getElementById('ls-nav-heading');
    const bodyNav = document.getElementById('ls-nav-body');
    const hasHeadingStyles = headings.length > 0;
    const hasBodyStyles = bodyTexts.length > 0;
    const activeMissingSection = activeLSNav === 'heading' && !hasHeadingStyles
      ? 'Heading Text'
      : activeLSNav === 'body' && !hasBodyStyles
        ? 'Text'
        : '';
    const missingTypographyNoticeHtml = activeMissingSection
      ? `<div style="margin: 12px 16px 0; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 11px; color: var(--muted); background: var(--bg-hover);">No variable detected for ${escapeHtml(activeMissingSection)} in this Figma file.</div>`
      : '';
    headingNav.style.display = '';
    bodyNav.style.display = '';
    const availableNavs = ['grid', 'heading', 'body'];
    if (!availableNavs.includes(activeLSNav)) {
      activeLSNav = availableNavs[0];
    }
    updateNavUi();
    document.getElementById('ls-count-heading').textContent = headings.length;
    document.getElementById('ls-count-body').textContent = bodyTexts.length;
    const sortTypography = (arr) => {
      return arr.sort((a, b) => {
        const nameA = a.name.split('/').pop().toLowerCase();
        const nameB = b.name.split('/').pop().toLowerCase();
        if (nameA === 'heading_small' && nameB === 'h1') return -1;
        if (nameA === 'h1' && nameB === 'heading_small') return 1;
        const valA = parseFloat(getResolvedVal(a)) || 0;
        const valB = parseFloat(getResolvedVal(b)) || 0;
        return valB - valA;
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
        const defaultWeight = getFontWeightDefault(section);
        localStyleDraft[section][rowKey] = {
          key: rowKey,
          name: tokenName,
          path: variable.name,
          fontPath: fontPathDefault,
          font: fontFamilyDefault,
          fontWeightPath: defaultWeight.path,
          fontWeight: defaultWeight.value,
          size: String(getResolvedVal(variable) ?? ''),
          lineHeight: String(section === 'heading' ? (headingLineHeightMap[tokenName.toLowerCase()] || 120) : 140),
          lineSpacing: '0',
          lineHeightIsPercent: localStyleUnits[section].lineHeightPercent,
          lineSpacingIsPercent: localStyleUnits[section].lineSpacingPercent,
          case: 'Original'
        };
      } else {
        localStyleDraft[section][rowKey].font = fontFamilyDefault;
        localStyleDraft[section][rowKey].size = String(getResolvedVal(variable) ?? '');
        if (!localStyleDraft[section][rowKey].fontPath) {
          localStyleDraft[section][rowKey].fontPath = fontPathDefault;
        }
        if (!localStyleDraft[section][rowKey].fontWeightPath) {
          const defaultWeight = getFontWeightDefault(section);
          localStyleDraft[section][rowKey].fontWeightPath = defaultWeight.path;
          localStyleDraft[section][rowKey].fontWeight = defaultWeight.value;
        }
        localStyleDraft[section][rowKey].lineHeightIsPercent = localStyleUnits[section].lineHeightPercent;
        localStyleDraft[section][rowKey].lineSpacingIsPercent = localStyleUnits[section].lineSpacingPercent;
      }
      return localStyleDraft[section][rowKey];
    };
    const createEditableCell = (section, rowKey, field, value, options = null, sample = 'Sample Text') => {
      const hasOptions = Array.isArray(options) && options.length > 0;
      const optionsAttr = hasOptions ? ` data-ls-options='${escapeHtml(JSON.stringify(options))}' data-ls-sample='${escapeHtml(sample)}'` : '';
      const editableMode = hasOptions ? 'false' : 'true';
      const extraClass = hasOptions ? ' ls-select-cell' : '';
      return `
        <td><div class="cell-content"><span class="table-input${extraClass}" contenteditable="${editableMode}" data-ls-section="${section}" data-ls-row="${rowKey}" data-ls-field="${field}"${optionsAttr}>${escapeHtml(value)}</span></div></td>
      `;
    };
    const createReadonlyCell = (value) => `
      <td><div class="cell-content"><span class="table-input">${escapeHtml(value)}</span></div></td>
    `;
    const createLinkedTokenCell = (path, label = path, section = '', rowKey = '', field = 'path') => `
      <td class="ls-token-cell">
        <div class="cell-content">
          <div class="alias-pill" title="${escapeHtml(path)}" onclick="showLinkedVariablesModal('${escapeHtml(path)}', event, '${escapeHtml(section)}', '${escapeHtml(rowKey)}', '${escapeHtml(field)}')">
            <span class="type-icon">
              <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; opacity: 0.75;">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
                <text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor" font-family="Inter, sans-serif">#</text>
              </svg>
            </span>
            <span class="alias-name">${escapeHtml(label)}</span>
          </div>
          <span class="link-btn" title="Connected" onclick="showLinkedVariablesModal('${escapeHtml(path)}', event, '${escapeHtml(section)}', '${escapeHtml(rowKey)}', '${escapeHtml(field)}')">
            <svg viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M18.84 15.16l1.16-1.16a5 5 0 0 0-7.07-7.07l-1.16 1.16M14 11l-4 4M5.16 8.84L4 10a5 5 0 0 0 7.07 7.07l1.16-1.16M2 2l20 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></path></svg>
          </span>
        </div>
      </td>
    `;
    const getGridOpacityNumber = (row) => Math.min(100, Math.max(0, toNumber(row.opacity, 100)));
    const createGridColorCell = (row) => {
      const opacity = getGridOpacityNumber(row);
      const normalizedColor = String(row.color || '#0080FF').trim() || '#0080FF';
      const swatchHtml = opacity < 100
        ? `<div class="color-swatch-picker color-swatch-split"><span class="color-swatch-solid" style="background-color: ${normalizedColor};"></span><span class="color-swatch-alpha" style="background-color: ${normalizedColor}; opacity: ${opacity / 100};"></span></div>`
        : `<div class="color-swatch-picker color-swatch-solid-only" style="background-color: ${normalizedColor}; background-image: none;"></div>`;
      return `
        <td>
          <div class="cell-content ls-grid-color-cell">
            <button class="swatch-trigger-btn" onclick="openLocalGridColorPicker('${row.key}', event)" aria-label="Open color picker">
              ${swatchHtml}
            </button>
            <span class="table-input ls-grid-color-input" contenteditable="true" data-ls-section="grid" data-ls-row="${row.key}" data-ls-field="color">${escapeHtml(row.color || '')}</span>
            <div class="opacity-separator"></div>
            <span class="opacity-value color-opacity-fixed">${opacity}%</span>
          </div>
        </td>
      `;
    };
    const createGridRow = (row) => `
      <tr>
        ${createReadonlyCell(row.name)}
        ${createEditableCell('grid', row.key, 'count', row.count)}
        ${createGridColorCell(row)}
        ${createEditableCell('grid', row.key, 'type', row.type)}
        ${createEditableCell('grid', row.key, 'width', row.width)}
        ${createEditableCell('grid', row.key, 'margin', row.margin)}
        ${createEditableCell('grid', row.key, 'gutter', row.gutter)}
      </tr>
    `;
    const createTypographyRowHtml = (section, row) => `
      <tr>
        ${createReadonlyCell(row.name)}
        ${createLinkedTokenCell(row.path, row.path, section, row.key, 'path')}
        ${createLinkedTokenCell(row.fontPath, row.font, section, row.key, 'fontPath')}
        ${row.fontWeightPath
          ? createLinkedTokenCell(row.fontWeightPath, row.fontWeight, section, row.key, 'fontWeightPath')
          : createEditableCell(section, row.key, 'fontWeight', row.fontWeight, primitiveFontWeightOptions, 'Ag')}
        ${createLinkedTokenCell(row.path, row.size, section, row.key, 'path')}
        ${createEditableCell(section, row.key, 'lineHeight', formatUnitValue(row.lineHeight, row.lineHeightIsPercent))}
        ${createEditableCell(section, row.key, 'lineSpacing', formatUnitValue(row.lineSpacing, row.lineSpacingIsPercent))}
        ${createEditableCell(section, row.key, 'case', row.case, textCaseOptions, 'Sample Text')}
      </tr>
    `;
    const buildTypographyPayloadRows = (section = 'all') => {
      const headingRows = sortedHeadings.map(h => ({ ...getTypographyRow('heading', h), section: 'heading' }));
      const bodyRows = sortedBodyTexts.map(b => ({ ...getTypographyRow('body', b), section: 'body' }));
      const mergedRows = section === 'heading'
        ? headingRows
        : section === 'body'
          ? bodyRows
          : [...headingRows, ...bodyRows];
      return mergedRows.map(row => ({
        ...row,
        lineHeightUnit: row.lineHeightIsPercent ? 'PERCENT' : 'PIXELS',
        lineSpacingUnit: row.lineSpacingIsPercent ? 'PERCENT' : 'PIXELS'
      }));
    };
    const bindEditors = () => {
      const persistValue = (editableEl, overrideValue = null) => {
        const section = editableEl.dataset.lsSection;
        const rowKey = editableEl.dataset.lsRow;
        const field = editableEl.dataset.lsField;
        const value = (overrideValue ?? editableEl.textContent).trim();
        const normalizedValue = (field === 'lineHeight' || field === 'lineSpacing') ? value.replace('%', '').trim() : value;
        if (!section || !rowKey || !field) return;
        if (section === 'grid') {
          const targetRow = localStyleDraft.grid.find(row => row.key === rowKey);
          if (!targetRow) return;
          targetRow[field] = normalizedValue;
          return;
        }
        if (!localStyleDraft[section][rowKey]) return;
        localStyleDraft[section][rowKey][field] = normalizedValue;
      };
      content.querySelectorAll('[data-ls-field]').forEach((editableEl) => {
        const options = editableEl.dataset.lsOptions ? JSON.parse(editableEl.dataset.lsOptions) : null;
        if (Array.isArray(options) && options.length > 0) {
          editableEl.addEventListener('click', () => {
            const section = editableEl.dataset.lsSection;
            const rowKey = editableEl.dataset.lsRow;
            const field = editableEl.dataset.lsField;
            const sample = editableEl.dataset.lsSample || 'Sample Text';
            const row = localStyleDraft[section]?.[rowKey];
            if (!section || !rowKey || !field || !row) return;
            openLocalOptionPicker({
              section,
              rowKey,
              field,
              options,
              sample,
              currentValue: String(row[field] ?? ''),
              fontFamily: row.font || 'Inter',
              anchorEl: editableEl
            });
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
            <th class="col-lg">Color</th>
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
      setImportButton('Import Grid', localStyleDraft.grid.length === 0, () => {
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
            <th class="col-sm">Size</th>
            <th class="col-md"><div class="ls-header-split"><span>Line Height</span><button class="ls-unit-btn ${localStyleUnits.heading.lineHeightPercent ? 'active' : ''}" onclick="toggleLocalUnit('heading','lineHeight',event)">%</button></div></th>
            <th class="col-md"><div class="ls-header-split"><span>Line Spacing</span><button class="ls-unit-btn ${localStyleUnits.heading.lineSpacingPercent ? 'active' : ''}" onclick="toggleLocalUnit('heading','lineSpacing',event)">%</button></div></th>
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
        setImportButton('Import Heading', rows.length === 0, () => {
          const payloadRows = buildTypographyPayloadRows('heading');
          parent.postMessage({ pluginMessage: { type: 'create-text-styles', data: { section: 'heading', rows: payloadRows } } }, '*');
        });
      } else {
        tableHtml = `
          <div style="padding: 60px 24px; text-align: center; color: var(--muted);">
            <div style="margin-bottom: 16px;">No heading variables detected.</div>
          </div>
        `;
        setImportButton('Import Heading', true, () => {});
      }
    } else if (activeLSNav === 'body') {
      const theadHtml = `
        <thead>
          <tr>
            <th class="col-md">Name</th>
            <th class="col-lg">Linked Token</th>
            <th class="col-md">Font</th>
            <th class="col-sm">Font Weight</th>
            <th class="col-sm">Size</th>
            <th class="col-md"><div class="ls-header-split"><span>Line Height</span><button class="ls-unit-btn ${localStyleUnits.body.lineHeightPercent ? 'active' : ''}" onclick="toggleLocalUnit('body','lineHeight',event)">%</button></div></th>
            <th class="col-md"><div class="ls-header-split"><span>Line Spacing</span><button class="ls-unit-btn ${localStyleUnits.body.lineSpacingPercent ? 'active' : ''}" onclick="toggleLocalUnit('body','lineSpacing',event)">%</button></div></th>
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
        setImportButton('Import Text', rows.length === 0, () => {
          const payloadRows = buildTypographyPayloadRows('body');
          parent.postMessage({ pluginMessage: { type: 'create-text-styles', data: { section: 'body', rows: payloadRows } } }, '*');
        });
      } else {
        tableHtml = `
          <div style="padding: 60px 24px; text-align: center; color: var(--muted);">
            <div style="margin-bottom: 16px;">No body variables detected.</div>
          </div>
        `;
        setImportButton('Import Text', true, () => {});
      }
    }

    content.innerHTML = `${missingTypographyNoticeHtml}${tableHtml}`;
    bindEditors();
  };

  const switchNav = (navId) => {
    activeLSNav = navId;
  };
  const toggleUnit = (section, field) => {
    const unitKey = field === 'lineHeight' ? 'lineHeightPercent' : 'lineSpacingPercent';
    localStyleUnits[section][unitKey] = !localStyleUnits[section][unitKey];
    Object.values(localStyleDraft[section]).forEach((row) => {
      row[field === 'lineHeight' ? 'lineHeightIsPercent' : 'lineSpacingIsPercent'] = localStyleUnits[section][unitKey];
    });
  };
  const getGridRow = (rowKey) => localStyleDraft.grid.find(item => item.key === rowKey);
  const setGridRowColor = (rowKey, color, opacity) => {
    const row = getGridRow(rowKey);
    if (!row) return;
    row.color = color;
    row.opacity = String(opacity);
  };
  const applyOptionSelection = (section, rowKey, field, value) => {
    if (!localStyleDraft?.[section]?.[rowKey]) return;
    localStyleDraft[section][rowKey][field] = String(value);
    if (field === 'fontWeight') {
      const key = String(value || '').toLowerCase().replace(/\s+/g, ' ');
      localStyleDraft[section][rowKey].fontWeightPath = fontWeightPathByValue[key] || '';
    }
  };
  const applyLinkedVariableSelection = (section, rowKey, field, variablePath, resolvedValue) => {
    if (!localStyleDraft?.[section]?.[rowKey]) return;
    const row = localStyleDraft[section][rowKey];
    const normalizedPath = String(variablePath || '').trim();
    if (!normalizedPath) return;
    if (field === 'fontPath') {
      row.fontPath = normalizedPath;
      row.font = String(resolvedValue || row.font || '');
      return;
    }
    if (field === 'fontWeightPath') {
      row.fontWeightPath = normalizedPath;
      row.fontWeight = String(resolvedValue || row.fontWeight || '');
      return;
    }
    row.path = normalizedPath;
    row.size = String(resolvedValue || row.size || '');
  };

  return {
    render,
    switchNav,
    toggleUnit,
    getGridRow,
    setGridRowColor,
    applyOptionSelection,
    applyLinkedVariableSelection
  };
}
