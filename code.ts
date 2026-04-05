// Figma Plugin: Style Library
// This plugin manages design tokens and styles.

const MODES_DATA = `{"id":"VariableCollectionId:1252:2473","name":"Modes (Desktop / Mobile)","modes":{"1252:2":"Desktop","1252:3":"Mobile"},"variableIds":["VariableID:3616:828","VariableID:3616:827","VariableID:3616:834","VariableID:3616:835","VariableID:3616:836","VariableID:3619:2817","VariableID:3619:2816","VariableID:3619:2815","VariableID:3619:2814","VariableID:3619:2813","VariableID:3642:53","VariableID:3619:2801","VariableID:3619:2800","VariableID:3619:2799","VariableID:3194:3312","VariableID:3194:3313","VariableID:3616:657","VariableID:3616:658","VariableID:3616:659","VariableID:3616:660","VariableID:1252:2474","VariableID:1252:2475","VariableID:1252:2476","VariableID:1252:2477","VariableID:1252:2478","VariableID:1252:2479","VariableID:1252:2480","VariableID:3616:662","VariableID:3616:661","VariableID:1252:2481","VariableID:1252:2482","VariableID:3614:2","VariableID:3220:3316","VariableID:3616:666","VariableID:3616:665","VariableID:3616:664","VariableID:3220:3317","VariableID:3225:2245","VariableID:3220:3384","VariableID:3220:3385","VariableID:3711:2"],"variables":[{"id":"VariableID:3616:828","name":"Screen Size/screen-size_desktop","description":"Desktop screen size","type":"FLOAT","valuesByMode":{"1252:2":1512,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:827"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":1512,"alias":null},"1252:3":{"resolvedValue":360,"alias":"VariableID:3616:827","aliasName":"Screen Size/screen-size_mobile"}},"scopes":["WIDTH_HEIGHT"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:827","name":"Screen Size/screen-size_mobile","description":"Phone screen size","type":"FLOAT","valuesByMode":{"1252:2":360,"1252:3":360},"resolvedValuesByMode":{"1252:2":{"resolvedValue":360,"alias":null},"1252:3":{"resolvedValue":360,"alias":null}},"scopes":["WIDTH_HEIGHT"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:834","name":"Section Margin/margin_large","description":"Left and right section margins for compact containers (1200 px width)","type":"FLOAT","valuesByMode":{"1252:2":156,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:836"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":156,"alias":null},"1252:3":{"resolvedValue":16,"alias":"VariableID:3616:836","aliasName":"Section Margin/margin_small"}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:835","name":"Section Margin/margin_medium","description":"Left and right section margins for wide containers (1400 px width and above)","type":"FLOAT","valuesByMode":{"1252:2":56,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:836"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":56,"alias":null},"1252:3":{"resolvedValue":16,"alias":"VariableID:3616:836","aliasName":"Section Margin/margin_small"}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:836","name":"Section Margin/margin_small","description":"Left and right section margins for mobile phone containers (328 px width and below)","type":"FLOAT","valuesByMode":{"1252:2":16,"1252:3":16},"resolvedValuesByMode":{"1252:2":{"resolvedValue":16,"alias":null},"1252:3":{"resolvedValue":16,"alias":null}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3619:2817","name":"Section Padding/section-padding_2xlarge","description":"Padding used for sections","type":"FLOAT","valuesByMode":{"1252:2":120,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3619:2813"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":120,"alias":null},"1252:3":{"resolvedValue":40,"alias":"VariableID:3619:2813","aliasName":"Section Padding/section-padding_small"}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3619:2816","name":"Section Padding/section-padding_xlarge","description":"Padding used for sections","type":"FLOAT","valuesByMode":{"1252:2":112,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3619:2813"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":112,"alias":null},"1252:3":{"resolvedValue":40,"alias":"VariableID:3619:2813","aliasName":"Section Padding/section-padding_small"}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3619:2815","name":"Section Padding/section-padding_large","description":"Padding used for sections","type":"FLOAT","valuesByMode":{"1252:2":80,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3619:2813"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":80,"alias":null},"1252:3":{"resolvedValue":40,"alias":"VariableID:3619:2813","aliasName":"Section Padding/section-padding_small"}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3619:2814","name":"Section Padding/section-padding_medium","description":"Padding used for sections","type":"FLOAT","valuesByMode":{"1252:2":56,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3619:2813"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":56,"alias":null},"1252:3":{"resolvedValue":40,"alias":"VariableID:3619:2813","aliasName":"Section Padding/section-padding_small"}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3619:2813","name":"Section Padding/section-padding_small","description":"Padding used for sections","type":"FLOAT","valuesByMode":{"1252:2":40,"1252:3":40},"resolvedValuesByMode":{"1252:2":{"resolvedValue":40,"alias":null},"1252:3":{"resolvedValue":40,"alias":null}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3642:53","name":"Section Padding/section-padding_xsmall","description":"Padding used for sections","type":"FLOAT","valuesByMode":{"1252:2":24,"1252:3":24},"resolvedValuesByMode":{"1252:2":{"resolvedValue":24,"alias":null},"1252:3":{"resolvedValue":24,"alias":null}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3619:2801","name":"Container/container_expanded","description":"Desktop container wide","type":"FLOAT","valuesByMode":{"1252:2":1400,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3619:2799"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":1400,"alias":null},"1252:3":{"resolvedValue":328,"alias":"VariableID:3619:2799","aliasName":"Container/container_small"}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3619:2800","name":"Container/container_compact","description":"Desktop container compact","type":"FLOAT","valuesByMode":{"1252:2":1200,"1252:3":{"type":"VARIABLE_ALIAS","id":"VariableID:3619:2799"}},"resolvedValuesByMode":{"1252:2":{"resolvedValue":1200,"alias":null},"1252:3":{"resolvedValue":328,"alias":"VariableID:3619:2799","aliasName":"Container/container_small"}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3619:2799","name":"Container/container_small","description":"Mobile phone container","type":"FLOAT","valuesByMode":{"1252:2":328,"1252:3":328},"resolvedValuesByMode":{"1252:2":{"resolvedValue":328,"alias":null},"1252:3":{"resolvedValue":328,"alias":null}},"scopes":["WIDTH_HEIGHT","GAP"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3194:3312","name":"Typography/Heading/heading_3xlarge","description":"Heading size modifiers for H1 to H6.","type":"FLOAT","valuesByMode":{"1252:2":240,"1252:3":128},"resolvedValuesByMode":{"1252:2":{"resolvedValue":240,"alias":null},"1252:3":{"resolvedValue":128,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3194:3313","name":"Typography/Heading/heading_2xlarge","description":"Heading size modifiers for H1 to H6.","type":"FLOAT","valuesByMode":{"1252:2":176,"1252:3":96},"resolvedValuesByMode":{"1252:2":{"resolvedValue":176,"alias":null},"1252:3":{"resolvedValue":96,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:657","name":"Typography/Heading/heading_xlarge","description":"Heading size modifiers for H1 to H6.","type":"FLOAT","valuesByMode":{"1252:2":128,"1252:3":64},"resolvedValuesByMode":{"1252:2":{"resolvedValue":128,"alias":null},"1252:3":{"resolvedValue":64,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:658","name":"Typography/Heading/heading_large","description":"Heading size modifiers for H1 to H6.","type":"FLOAT","valuesByMode":{"1252:2":96,"1252:3":54},"resolvedValuesByMode":{"1252:2":{"resolvedValue":96,"alias":null},"1252:3":{"resolvedValue":54,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:659","name":"Typography/Heading/heading_medium","description":"Heading size modifiers for H1 to H6.","type":"FLOAT","valuesByMode":{"1252:2":64,"1252:3":46},"resolvedValuesByMode":{"1252:2":{"resolvedValue":64,"alias":null},"1252:3":{"resolvedValue":46,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:660","name":"Typography/Heading/heading_small","description":"Heading size modifiers for H1 to H6.","type":"FLOAT","valuesByMode":{"1252:2":52,"1252:3":42},"resolvedValuesByMode":{"1252:2":{"resolvedValue":52,"alias":null},"1252:3":{"resolvedValue":42,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2474","name":"Typography/Heading/h1","description":"Heading 1","type":"FLOAT","valuesByMode":{"1252:2":56,"1252:3":40},"resolvedValuesByMode":{"1252:2":{"resolvedValue":56,"alias":null},"1252:3":{"resolvedValue":40,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2475","name":"Typography/Heading/h2","description":"Heading 2","type":"FLOAT","valuesByMode":{"1252:2":48,"1252:3":36},"resolvedValuesByMode":{"1252:2":{"resolvedValue":48,"alias":null},"1252:3":{"resolvedValue":36,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2476","name":"Typography/Heading/h3","description":"Heading 3","type":"FLOAT","valuesByMode":{"1252:2":40,"1252:3":32},"resolvedValuesByMode":{"1252:2":{"resolvedValue":40,"alias":null},"1252:3":{"resolvedValue":32,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2477","name":"Typography/Heading/h4","description":"Heading 4","type":"FLOAT","valuesByMode":{"1252:2":32,"1252:3":24},"resolvedValuesByMode":{"1252:2":{"resolvedValue":32,"alias":null},"1252:3":{"resolvedValue":24,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2478","name":"Typography/Heading/h5","description":"Heading 5","type":"FLOAT","valuesByMode":{"1252:2":24,"1252:3":20},"resolvedValuesByMode":{"1252:2":{"resolvedValue":24,"alias":null},"1252:3":{"resolvedValue":20,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2479","name":"Typography/Heading/h6","description":"Heading 6","type":"FLOAT","valuesByMode":{"1252:2":20,"1252:3":18},"resolvedValuesByMode":{"1252:2":{"resolvedValue":20,"alias":null},"1252:3":{"resolvedValue":18,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2480","name":"Typography/Text/text_xlarge","description":"","type":"FLOAT","valuesByMode":{"1252:2":24,"1252:3":22},"resolvedValuesByMode":{"1252:2":{"resolvedValue":24,"alias":null},"1252:3":{"resolvedValue":22,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:662","name":"Typography/Text/text_large","description":"","type":"FLOAT","valuesByMode":{"1252:2":20,"1252:3":20},"resolvedValuesByMode":{"1252:2":{"resolvedValue":20,"alias":null},"1252:3":{"resolvedValue":20,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:661","name":"Typography/Text/text_medium","description":"","type":"FLOAT","valuesByMode":{"1252:2":18,"1252:3":18},"resolvedValuesByMode":{"1252:2":{"resolvedValue":18,"alias":null},"1252:3":{"resolvedValue":18,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2481","name":"Typography/Text/text_default","description":"","type":"FLOAT","valuesByMode":{"1252:2":16,"1252:3":16},"resolvedValuesByMode":{"1252:2":{"resolvedValue":16,"alias":null},"1252:3":{"resolvedValue":16,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:1252:2482","name":"Typography/Text/text_small","description":"","type":"FLOAT","valuesByMode":{"1252:2":14,"1252:3":14},"resolvedValuesByMode":{"1252:2":{"resolvedValue":14,"alias":null},"1252:3":{"resolvedValue":14,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3614:2","name":"Typography/Text/text_xsmall","description":"","type":"FLOAT","valuesByMode":{"1252:2":12,"1252:3":12},"resolvedValuesByMode":{"1252:2":{"resolvedValue":12,"alias":null},"1252:3":{"resolvedValue":12,"alias":null}},"scopes":["FONT_SIZE"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3220:3316","name":"Typography/Navlinks/navlink_2xlarge","description":"","type":"FLOAT","valuesByMode":{"1252:2":24,"1252:3":24},"resolvedValuesByMode":{"1252:2":{"resolvedValue":24,"alias":null},"1252:3":{"resolvedValue":24,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:666","name":"Typography/Navlinks/navlink_xlarge","description":"","type":"FLOAT","valuesByMode":{"1252:2":20,"1252:3":20},"resolvedValuesByMode":{"1252:2":{"resolvedValue":20,"alias":null},"1252:3":{"resolvedValue":20,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:665","name":"Typography/Navlinks/navlink_large","description":"","type":"FLOAT","valuesByMode":{"1252:2":18,"1252:3":18},"resolvedValuesByMode":{"1252:2":{"resolvedValue":18,"alias":null},"1252:3":{"resolvedValue":18,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:664","name":"Typography/Navlinks/navlink_default","description":"","type":"FLOAT","valuesByMode":{"1252:2":16,"1252:3":16},"resolvedValuesByMode":{"1252:2":{"resolvedValue":16,"alias":null},"1252:3":{"resolvedValue":16,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3220:3317","name":"Typography/Navlinks/navlink_small","description":"","type":"FLOAT","valuesByMode":{"1252:2":14,"1252:3":14},"resolvedValuesByMode":{"1252:2":{"resolvedValue":14,"alias":null},"1252:3":{"resolvedValue":14,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3225:2245","name":"Typography/Button Text/button-text_large","description":"","type":"FLOAT","valuesByMode":{"1252:2":18,"1252:3":18},"resolvedValuesByMode":{"1252:2":{"resolvedValue":18,"alias":null},"1252:3":{"resolvedValue":18,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3220:3384","name":"Typography/Button Text/button-text_default","description":"","type":"FLOAT","valuesByMode":{"1252:2":16,"1252:3":16},"resolvedValuesByMode":{"1252:2":{"resolvedValue":16,"alias":null},"1252:3":{"resolvedValue":16,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3220:3385","name":"Typography/Button Text/button-text_small","description":"","type":"FLOAT","valuesByMode":{"1252:2":14,"1252:3":14},"resolvedValuesByMode":{"1252:2":{"resolvedValue":14,"alias":null},"1252:3":{"resolvedValue":14,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3711:2","name":"Visibility/show","description":"","type":"BOOLEAN","valuesByMode":{"1252:2":true,"1252:3":false},"resolvedValuesByMode":{"1252:2":{"resolvedValue":true,"alias":null},"1252:3":{"resolvedValue":false,"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}}]}`;
const PRIMITIVES_DATA = `{"id":"VariableCollectionId:3286:3508","name":"Primitives","modes":{"3286:0":"Mode 1"},"variableIds":["VariableID:3616:794","VariableID:3616:819","VariableID:3616:667","VariableID:3616:672","VariableID:3616:668","VariableID:3616:669","VariableID:3616:670","VariableID:3616:671","VariableID:3710:2","VariableID:3616:792","VariableID:3616:790","VariableID:3616:802","VariableID:3616:817","VariableID:3616:791","VariableID:3616:788","VariableID:3616:789","VariableID:3616:810","VariableID:3616:787","VariableID:3616:800","VariableID:3642:49","VariableID:3616:798","VariableID:3616:786","VariableID:3616:821","VariableID:3616:812","VariableID:3616:818","VariableID:3616:806","VariableID:3616:808","VariableID:3616:815","VariableID:3616:807","VariableID:3616:813","VariableID:3616:809","VariableID:3616:820","VariableID:3616:796","VariableID:3616:805","VariableID:3616:803","VariableID:3616:804","VariableID:3616:814","VariableID:3616:799","VariableID:3616:811","VariableID:3616:801","VariableID:3616:816","VariableID:3616:795","VariableID:3616:797","VariableID:3616:793","VariableID:3616:677","VariableID:3616:676","VariableID:3616:673","VariableID:3616:674","VariableID:3616:675"],"variables":[{"id":"VariableID:3616:794","name":"Color/Brand Colors/white","description":"100% White","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:819","name":"Color/Brand Colors/black","description":"100% Black","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:667","name":"Typography/Font Family/font-family","description":"Font family","type":"STRING","valuesByMode":{"3286:0":"Inter"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Inter","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:672","name":"Typography/Font Weight/light","description":"Font weight: Light","type":"STRING","valuesByMode":{"3286:0":"Light"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Light","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:668","name":"Typography/Font Weight/regular","description":"Font weight: Regular","type":"STRING","valuesByMode":{"3286:0":"Regular"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Regular","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:669","name":"Typography/Font Weight/medium","description":"Font weight: Medium","type":"STRING","valuesByMode":{"3286:0":"Medium"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Medium","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:670","name":"Typography/Font Weight/semi bold","description":"Font weight: Semi Bold","type":"STRING","valuesByMode":{"3286:0":"Semi Bold"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Semi Bold","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:671","name":"Typography/Font Weight/bold","description":"Font weight: Bold","type":"STRING","valuesByMode":{"3286:0":"Bold"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Bold","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3710:2","name":"Typography/Font Weight/extra bold","description":"Font weight: Bold","type":"STRING","valuesByMode":{"3286:0":"Extra Bold"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Extra Bold","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:792","name":"Typography/Typography Color/heading-color_default","description":"Heading default text color.","type":"COLOR","valuesByMode":{"3286:0":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:819"}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":1},"alias":"VariableID:3616:819","aliasName":"Color/Brand Colors/black"}},"scopes":["TEXT_FILL"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:790","name":"Typography/Typography Color/heading-color_inv","description":"Heading text color inverse","type":"COLOR","valuesByMode":{"3286:0":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:794"}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":1},"alias":"VariableID:3616:794","aliasName":"Color/Brand Colors/white"}},"scopes":["TEXT_FILL"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:802","name":"Typography/Typography Color/subheading-color_default","description":"Sub heading default text color","type":"COLOR","valuesByMode":{"3286:0":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:819"}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":1},"alias":"VariableID:3616:819","aliasName":"Color/Brand Colors/black"}},"scopes":["TEXT_FILL"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:817","name":"Typography/Typography Color/subheading-color_inv","description":"Sub heading text color inverse","type":"COLOR","valuesByMode":{"3286:0":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:794"}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":1},"alias":"VariableID:3616:794","aliasName":"Color/Brand Colors/white"}},"scopes":["TEXT_FILL"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:791","name":"Typography/Typography Color/body-color_default","description":"Body text default color","type":"COLOR","valuesByMode":{"3286:0":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:821"}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.23529411852359772,"g":0.23529411852359772,"b":0.23529411852359772,"a":1},"alias":"VariableID:3616:821","aliasName":"Color/Grey Tones/grey-700"}},"scopes":["TEXT_FILL"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:788","name":"Typography/Typography Color/body-color_inv","description":"body text color inverse","type":"COLOR","valuesByMode":{"3286:0":{"type":"VARIABLE_ALIAS","id":"VariableID:3616:794"}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":1},"alias":"VariableID:3616:794","aliasName":"Color/Brand Colors/white"}},"scopes":["TEXT_FILL"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:789","name":"Color/Grey Tones/grey-100","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.95686274766922,"g":0.95686274766922,"b":0.95686274766922,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.95686274766922,"g":0.95686274766922,"b":0.95686274766922,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:810","name":"Color/Grey Tones/grey-200","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.8627451062202454,"g":0.8627451062202454,"b":0.8627451062202454,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.8627451062202454,"g":0.8627451062202454,"b":0.8627451062202454,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:787","name":"Color/Grey Tones/grey-300","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.7490196228027344,"g":0.7490196228027344,"b":0.7490196228027344,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.7490196228027344,"g":0.7490196228027344,"b":0.7490196228027344,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:800","name":"Color/Grey Tones/grey-400","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.6078431606292725,"g":0.6078431606292725,"b":0.6078431606292725,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.6078431606292725,"g":0.6078431606292725,"b":0.6078431606292725,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3642:49","name":"Color/Grey Tones/grey-50","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.9800000190734863,"g":0.9800000190734863,"b":0.9800000190734863,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.9800000190734863,"g":0.9800000190734863,"b":0.9800000190734863,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:798","name":"Color/Grey Tones/grey-500","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.47843137383461,"g":0.47843137383461,"b":0.47843137383461,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.47843137383461,"g":0.47843137383461,"b":0.47843137383461,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:786","name":"Color/Grey Tones/grey-600","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.3529411852359772,"g":0.3529411852359772,"b":0.3529411852359772,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.3529411852359772,"g":0.3529411852359772,"b":0.3529411852359772,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:821","name":"Color/Grey Tones/grey-700","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.23529411852359772,"g":0.23529411852359772,"b":0.23529411852359772,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.23529411852359772,"g":0.23529411852359772,"b":0.23529411852359772,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:812","name":"Color/Grey Tones/grey-800","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.10980392247438431,"g":0.10980392247438431,"b":0.10980392247438431,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.10980392247438431,"g":0.10980392247438431,"b":0.10980392247438431,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:818","name":"Color/Grey Tones/grey-900","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0.05882352963089943,"g":0.05882352963089943,"b":0.05882352963089943,"a":1}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0.05882352963089943,"g":0.05882352963089943,"b":0.05882352963089943,"a":1},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:806","name":"Color/Opacity White/transparent","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:808","name":"Color/Opacity White/white 10","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.10000000149011612}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.10000000149011612},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:815","name":"Color/Opacity White/white 20","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.20000000298023224}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.20000000298023224},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:807","name":"Color/Opacity White/white 30","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.30000001192092896}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.30000001192092896},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:813","name":"Color/Opacity White/white 40","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.4000000059604645}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.4000000059604645},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:809","name":"Color/Opacity White/white 5","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.05000000074505806}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.05000000074505806},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:820","name":"Color/Opacity White/white 50","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.5}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.5},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:796","name":"Color/Opacity White/white 60","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.6000000238418579}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.6000000238418579},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:805","name":"Color/Opacity White/white 70","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.699999988079071}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.699999988079071},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:803","name":"Color/Opacity White/white 80","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":1,"g":1,"b":1,"a":0.800000011920929}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":1,"g":1,"b":1,"a":0.800000011920929},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:804","name":"Color/Opcaity Black/black 10","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.10000000149011612}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.10000000149011612},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:814","name":"Color/Opcaity Black/black 20","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.20000000298023224}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.20000000298023224},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:799","name":"Color/Opcaity Black/black 30","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.30000001192092896}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.30000001192092896},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:811","name":"Color/Opcaity Black/black 40","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.4000000059604645}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.4000000059604645},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:801","name":"Color/Opcaity Black/black 5","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.05000000074505806}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.05000000074505806},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:816","name":"Color/Opcaity Black/black 50","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.5}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.5},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:795","name":"Color/Opcaity Black/black 60","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.6000000238418579}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.6000000238418579},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:797","name":"Color/Opcaity Black/black 70","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.699999988079071}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.699999988079071},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:793","name":"Color/Opcaity Black/black 80","description":"","type":"COLOR","valuesByMode":{"3286:0":{"r":0,"g":0,"b":0,"a":0.800000011920929}},"resolvedValuesByMode":{"3286:0":{"resolvedValue":{"r":0,"g":0,"b":0,"a":0.800000011920929},"alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:677","name":"Typography/Font Weight/italic","description":"Font weight: Italic","type":"STRING","valuesByMode":{"3286:0":"Italic"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Italic","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:676","name":"Typography/Font Weight/italic-bold","description":"Font weight: Italic Bold","type":"STRING","valuesByMode":{"3286:0":"Bold Italic"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Bold Italic","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:673","name":"Typography/Font Weight/italic-light","description":"Font weight: Italic Light","type":"STRING","valuesByMode":{"3286:0":"Light Italic"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Light Italic","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:674","name":"Typography/Font Weight/italic-medium","description":"Font weight: Italic Medium","type":"STRING","valuesByMode":{"3286:0":"Medium Italic"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Medium Italic","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}},{"id":"VariableID:3616:675","name":"Typography/Font Weight/italic-semi bold","description":"Font weight: Italic Semi Bold","type":"STRING","valuesByMode":{"3286:0":"Semi Bold Italic"},"resolvedValuesByMode":{"3286:0":{"resolvedValue":"Semi Bold Italic","alias":null}},"scopes":["ALL_SCOPES"],"hiddenFromPublishing":false,"codeSyntax":{}}]}`;

// Show the UI with increased height (10% taller)
figma.showUI(__html__, { width: 986, height: 640, themeColors: true });
figma.loadAllPagesAsync().catch(() => {});

// Map to track variable IDs across collections for alias resolution
const variableIdMap = new Map<string, string>();
type SLVariableAlias = { type: 'VARIABLE_ALIAS'; id: string };
type SLColorValue = { r: number; g: number; b: number; a: number };
type SLVariableValue = string | number | boolean | SLVariableAlias | SLColorValue;
type SLVariableJSON = {
  id: string;
  name: string;
  type: string;
  description?: string;
  valuesByMode: Record<string, SLVariableValue>;
  resolvedValuesByMode?: Record<string, unknown>;
};
type SLCollectionJSON = {
  id: string;
  name: string;
  modes: Record<string, string>;
  variableIds?: string[];
  variables: SLVariableJSON[];
};
const orderCollectionVariables = (collectionData: SLCollectionJSON): SLCollectionJSON => {
  if (!Array.isArray(collectionData.variableIds)) return collectionData;
  const variableById = new Map<string, SLVariableJSON>(collectionData.variables.map((variable) => [variable.id, variable]));
  collectionData.variables = collectionData.variableIds
    .map((id) => variableById.get(id))
    .filter((variable): variable is SLVariableJSON => !!variable);
  return collectionData;
};
const orderByIds = <T extends { id: string }>(items: T[], ids?: string[]): T[] => {
  if (!Array.isArray(ids)) return items;
  const itemById = new Map<string, T>(items.map((item) => [item.id, item]));
  return ids.map((id) => itemById.get(id)).filter((item): item is T => !!item);
};
const isVariableAliasValue = (value: unknown): value is VariableAlias => {
  if (typeof value !== 'object' || value === null) return false;
  if (!('type' in value) || !('id' in value)) return false;
  return (value as { type?: unknown }).type === 'VARIABLE_ALIAS' && typeof (value as { id?: unknown }).id === 'string';
};
const getFallbackModeId = (variable: Variable): string | null => {
  const modeIds = Object.keys(variable.valuesByMode || {});
  return modeIds.length > 0 ? modeIds[0] : null;
};
const resolveValueByMode = (
  variable: Variable,
  modeId: string,
  variableById: Map<string, Variable>,
  visited: Set<string> = new Set()
): VariableValue => {
  if (visited.has(variable.id)) {
    const fallbackModeId = getFallbackModeId(variable);
    return variable.valuesByMode[modeId] ?? (fallbackModeId ? variable.valuesByMode[fallbackModeId] : undefined);
  }
  visited.add(variable.id);
  const fallbackModeId = getFallbackModeId(variable);
  const currentValue = variable.valuesByMode[modeId] ?? (fallbackModeId ? variable.valuesByMode[fallbackModeId] : undefined);
  if (!isVariableAliasValue(currentValue)) {
    return currentValue;
  }
  const targetVariable = variableById.get(currentValue.id);
  if (!targetVariable) {
    return currentValue;
  }
  const targetModeId = targetVariable.valuesByMode[modeId] !== undefined
    ? modeId
    : getFallbackModeId(targetVariable);
  if (!targetModeId) {
    return currentValue;
  }
  return resolveValueByMode(targetVariable, targetModeId, variableById, visited);
};
const buildResolvedValuesByMode = (variable: Variable, variableById: Map<string, Variable>): Record<string, VariableValue> => {
  const modeIds = Object.keys(variable.valuesByMode || {});
  const resolved: Record<string, VariableValue> = {};
  for (const modeId of modeIds) {
    resolved[modeId] = resolveValueByMode(variable, modeId, variableById);
  }
  return resolved;
};

const sendCollectionsStatus = async () => {
  const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const existingVariables = await figma.variables.getLocalVariablesAsync();
  const variableById = new Map<string, Variable>(existingVariables.map((variable) => [variable.id, variable]));
  
  const modesData = orderCollectionVariables(JSON.parse(MODES_DATA));
  const primitivesData = orderCollectionVariables(JSON.parse(PRIMITIVES_DATA));
  
  const modesExist = existingCollections.some(c => c.name === modesData.name && existingVariables.some(v => v.variableCollectionId === c.id));
  const primitivesExist = existingCollections.some(c => c.name === primitivesData.name && existingVariables.some(v => v.variableCollectionId === c.id));
  const modesCollection = existingCollections.find(c => c.name === modesData.name);
  const primitivesCollection = existingCollections.find(c => c.name === primitivesData.name);
  const headingCount = modesCollection
    ? existingVariables.filter(v => v.variableCollectionId === modesCollection.id && v.name.startsWith('Typography/Heading/')).length
    : 0;
  const bodyCount = modesCollection
    ? existingVariables.filter(v =>
      v.variableCollectionId === modesCollection.id &&
      (v.name.startsWith('Typography/Text/') || v.name.startsWith('Typography/Body/'))
    ).length
    : 0;
  const modesPreviewOrderIds = Array.isArray(modesCollection?.variableIds) && modesCollection.variableIds.length > 0
    ? modesCollection.variableIds
    : modesData.variableIds;
  const primitivesPreviewOrderIds = Array.isArray(primitivesCollection?.variableIds) && primitivesCollection.variableIds.length > 0
    ? primitivesCollection.variableIds
    : primitivesData.variableIds;
  const figmaModesPreview = {
    id: modesCollection?.id || modesData.id,
    name: modesCollection?.name || modesData.name,
    modes: modesCollection
      ? modesCollection.modes.reduce((acc, mode) => {
        acc[mode.modeId] = mode.name;
        return acc;
      }, {} as Record<string, string>)
      : modesData.modes,
    variables: orderByIds(
      modesCollection
        ? existingVariables.filter(v => v.variableCollectionId === modesCollection.id)
        : [],
      modesPreviewOrderIds
    ).map(v => ({
        id: v.id,
        name: v.name,
        type: v.resolvedType,
        valuesByMode: buildResolvedValuesByMode(v, variableById)
      }))
  };
  const figmaPrimitivesPreview = {
    id: primitivesCollection?.id || primitivesData.id,
    name: primitivesCollection?.name || primitivesData.name,
    modes: primitivesCollection
      ? primitivesCollection.modes.reduce((acc, mode) => {
        acc[mode.modeId] = mode.name;
        return acc;
      }, {} as Record<string, string>)
      : primitivesData.modes,
    variables: orderByIds(
      primitivesCollection
        ? existingVariables.filter(v => v.variableCollectionId === primitivesCollection.id)
        : [],
      primitivesPreviewOrderIds
    ).map(v => ({
        id: v.id,
        name: v.name,
        type: v.resolvedType,
        valuesByMode: buildResolvedValuesByMode(v, variableById)
      }))
  };
  
  figma.ui.postMessage({ 
    type: 'collections-status', 
    modesExist,
    primitivesExist,
    headingCount,
    bodyCount,
    preview: {
      modes: modesData,
      primitives: primitivesData
    },
    figmaPreview: {
      modes: figmaModesPreview,
      primitives: figmaPrimitivesPreview
    }
  });
};

let collectionsStatusDebounce: number | null = null;
const queueCollectionsStatus = () => {
  if (collectionsStatusDebounce !== null) {
    clearTimeout(collectionsStatusDebounce);
  }
  collectionsStatusDebounce = setTimeout(() => {
    collectionsStatusDebounce = null;
    sendCollectionsStatus().catch(() => {});
  }, 120) as unknown as number;
};

// Helper to notify UI of selection changes
const updateSelectionInfo = () => {
  const selection = figma.currentPage.selection;
  figma.ui.postMessage({ 
    type: 'selection-change', 
    count: selection.length,
    names: selection.map(n => n.name).slice(0, 3)
  });
};

figma.on("selectionchange", updateSelectionInfo);
figma.on("documentchange", queueCollectionsStatus);
updateSelectionInfo();

figma.ui.onmessage = async (msg: { type: string, data?: any }) => {
  if (msg.type === 'check-collections') {
    await sendCollectionsStatus();
  }

  if (msg.type === 'create-grid-style') {
    const existingStyles = await figma.getLocalGridStylesAsync();
    const fallbackRows = [
      { name: 'Grid/Expanded', count: 12, margin: 156, gutter: 32, color: '#0080FF', opacity: 10, type: 'Stretch', width: 'Auto' },
      { name: 'Grid/Compact', count: 12, margin: 56, gutter: 32, color: '#0080FF', opacity: 10, type: 'Stretch', width: 'Auto' },
      { name: 'Grid/Mobile', count: 4, margin: 16, gutter: 16, color: '#0080FF', opacity: 10, type: 'Stretch', width: 'Auto' }
    ];
    const rows = Array.isArray(msg.data?.rows) && msg.data.rows.length > 0 ? msg.data.rows : fallbackRows;
    const toNumber = (value: unknown, fallback: number) => {
      const parsed = parseFloat(String(value ?? '').replace(/[^0-9.-]/g, ''));
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const parseColor = (hexInput: string, opacityInput: unknown) => {
      const hex = String(hexInput || '#0080FF').replace('#', '').trim();
      const normalized = hex.length === 3
        ? hex.split('').map(ch => `${ch}${ch}`).join('')
        : hex;
      const validHex = /^[0-9a-fA-F]{6}$/.test(normalized) ? normalized : '0080FF';
      const r = parseInt(validHex.slice(0, 2), 16) / 255;
      const g = parseInt(validHex.slice(2, 4), 16) / 255;
      const b = parseInt(validHex.slice(4, 6), 16) / 255;
      const a = Math.max(0, Math.min(1, toNumber(opacityInput, 10) / 100));
      return { r, g, b, a };
    };
    const toAlignment = (value: unknown): "MIN" | "CENTER" | "STRETCH" | "MAX" => {
      const normalized = String(value || 'STRETCH').trim().toUpperCase();
      if (normalized === 'LEFT' || normalized === 'MIN') return 'MIN';
      if (normalized === 'RIGHT' || normalized === 'MAX') return 'MAX';
      if (normalized === 'CENTER') return 'CENTER';
      return 'STRETCH';
    };

    for (const row of rows) {
      const styleName = String(row.name || '').trim();
      if (!styleName) continue;
      let gridStyle = existingStyles.find(s => s.name === styleName);
      if (!gridStyle) {
        gridStyle = figma.createGridStyle();
        gridStyle.name = styleName;
      }
      const alignment = toAlignment(row.type);
      const width = String(row.width ?? '').trim();
      const parsedWidth = toNumber(width, 0);
      const grid: LayoutGrid = {
        pattern: 'COLUMNS',
        alignment,
        gutterSize: Math.max(0, toNumber(row.gutter, 0)),
        count: Math.max(1, Math.round(toNumber(row.count, 12))),
        offset: Math.max(0, toNumber(row.margin, 0)),
        color: parseColor(row.color, row.opacity),
        ...(parsedWidth > 0 ? { sectionSize: parsedWidth } : {})
      };
      gridStyle.layoutGrids = [grid];
    }
    
    figma.notify('Grid Styles (Expanded, Compact, Mobile) Created!');
  }

  if (msg.type === 'create-text-styles') {
    const existingStyles = await figma.getLocalTextStylesAsync();
    const customRows = Array.isArray(msg.data?.rows) ? msg.data.rows : [];
    if (customRows.length > 0) {
      const defaultSectionLabel = msg.data?.section === 'heading' ? 'Heading' : 'Text';
      const toNumber = (value: unknown, fallback: number) => {
        const parsed = parseFloat(String(value ?? '').replace(/[^0-9.-]/g, ''));
        return Number.isFinite(parsed) ? parsed : fallback;
      };
      const toTextCase = (value: unknown): TextCase => {
        const normalized = String(value || 'ORIGINAL').trim().toUpperCase().replace(/\s+/g, '_');
        const map: Record<string, TextCase> = {
          ORIGINAL: 'ORIGINAL',
          UPPER: 'UPPER',
          LOWER: 'LOWER',
          TITLE: 'TITLE',
          SMALL_CAPS: 'SMALL_CAPS',
          FORCED_SMALL_CAPS: 'SMALL_CAPS_FORCED',
          SMALL_CAPS_FORCED: 'SMALL_CAPS_FORCED'
        };
        return map[normalized] || 'ORIGINAL';
      };
      const loadFontSafe = async (family: string, style: string) => {
        try {
          await figma.loadFontAsync({ family, style });
          return { family, style };
        } catch {
          await figma.loadFontAsync({ family, style: 'Regular' });
          return { family, style: 'Regular' };
        }
      };
      const normalizeFontFamily = (value: unknown) => {
        const raw = String(value || '').trim();
        if (!raw) return 'Inter';
        const primary = raw.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
        return primary || 'Inter';
      };
      const normalizeFontStyle = (value: unknown) => {
        const raw = String(value || '').trim();
        if (!raw) return 'Regular';
        const compact = raw.replace(/\s+/g, '').toLowerCase();
        const numericMap: Record<string, string> = {
          '100': 'Thin',
          '200': 'Extra Light',
          '300': 'Light',
          '400': 'Regular',
          '500': 'Medium',
          '600': 'Semi Bold',
          '700': 'Bold',
          '800': 'Extra Bold',
          '900': 'Black'
        };
        return numericMap[compact] || raw;
      };
      const localVariables = await figma.variables.getLocalVariablesAsync();
      const normalizeComparable = (value: unknown) => String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, '');
      const findVariableByPath = (path: unknown) => {
        const normalized = String(path || '').trim().toLowerCase();
        if (!normalized) return null;
        return localVariables.find(v => v.name.toLowerCase() === normalized) || null;
      };
      const resolveVariableValue = (inputVariable: Variable | null) => {
        const variable = inputVariable;
        if (!variable) return null;
        const visited = new Set<string>();
        let current = variable;
        while (current && !visited.has(current.id)) {
          visited.add(current.id);
          const currentModeIds = Object.keys(current.valuesByMode || {});
          if (currentModeIds.length === 0) return null;
          const currentVal = current.valuesByMode[currentModeIds[0]];
          if (
            currentVal &&
            typeof currentVal === 'object' &&
            'type' in currentVal &&
            currentVal.type === 'VARIABLE_ALIAS'
          ) {
            const target = localVariables.find(v => v.id === currentVal.id);
            if (!target) return null;
            current = target;
            continue;
          }
          return currentVal;
        }
        return null;
      };
      const findTypographyVariable = (path: unknown, folderPrefix: string, tokenHint: unknown) => {
        const byPath = findVariableByPath(path);
        if (byPath) return byPath;
        const prefix = folderPrefix.toLowerCase();
        const candidates = localVariables.filter(v => v.name.toLowerCase().startsWith(prefix));
        if (candidates.length === 0) return null;
        const hint = normalizeComparable(tokenHint);
        if (!hint) return candidates[0];
        const byName = candidates.find(v => normalizeComparable(v.name.split('/').pop()) === hint);
        if (byName) return byName;
        const byValue = candidates.find(v => normalizeComparable(resolveVariableValue(v)) === hint);
        return byValue || candidates[0];
      };

      for (const row of customRows) {
        const sizeVariable = findVariableByPath(row.path);
        const fontFamilyVariable = findTypographyVariable(row.fontPath, 'Typography/Font Family/', row.font);
        const fontWeightVariable = findTypographyVariable(row.fontWeightPath, 'Typography/Font Weight/', row.fontWeight);
        const resolvedSize = resolveVariableValue(sizeVariable);
        const size = Math.max(1, toNumber(resolvedSize ?? row.size, 16));
        const lineHeight = Math.max(1, toNumber(row.lineHeight, 140));
        const lineSpacing = toNumber(row.lineSpacing, 0);
        const lineHeightUnit = String(row.lineHeightUnit || 'PERCENT').toUpperCase() === 'PIXELS' ? 'PIXELS' : 'PERCENT';
        const lineSpacingUnit = String(row.lineSpacingUnit || 'PERCENT').toUpperCase() === 'PIXELS' ? 'PIXELS' : 'PERCENT';
        const resolvedFontFamily = resolveVariableValue(fontFamilyVariable);
        const resolvedFontStyle = resolveVariableValue(fontWeightVariable);
        const fontFamily = normalizeFontFamily(resolvedFontFamily ?? row.font);
        const fontStyle = normalizeFontStyle(resolvedFontStyle ?? row.fontWeight);
        const fontName = await loadFontSafe(fontFamily, fontStyle);
        const rowPath = String(row.path || '').trim();
        const rowNameRaw = rowPath || String(row.name || 'Style').trim();
        const rowName = rowNameRaw.split('/').pop() || rowNameRaw;
        const rowSectionLabel = String(row.section || '').toLowerCase() === 'heading'
          ? 'Heading'
          : (String(row.section || '').toLowerCase() === 'body' ? 'Text' : defaultSectionLabel);
        const styleName = `${rowSectionLabel}/${rowName} - ${size}/${lineHeight}`;

        let textStyle = existingStyles.find(s => s.name === styleName);
        if (!textStyle) {
          textStyle = figma.createTextStyle();
          textStyle.name = styleName;
        }

        textStyle.fontName = fontName;
        textStyle.fontSize = size;
        textStyle.lineHeight = { value: lineHeight, unit: lineHeightUnit };
        textStyle.letterSpacing = { value: lineSpacing, unit: lineSpacingUnit };
        textStyle.textCase = toTextCase(row.case);
        if (sizeVariable && sizeVariable.resolvedType === 'FLOAT') {
          textStyle.setBoundVariable('fontSize', sizeVariable);
        }
        if (fontFamilyVariable && fontFamilyVariable.resolvedType === 'STRING') {
          textStyle.setBoundVariable('fontFamily', fontFamilyVariable);
        }
        if (fontWeightVariable) {
          if (fontWeightVariable.resolvedType === 'STRING') {
            let stringWeightBound = false;
            try {
              textStyle.setBoundVariable('fontWeight', fontWeightVariable);
              stringWeightBound = true;
            } catch {
              stringWeightBound = false;
            }
            if (!stringWeightBound) {
              textStyle.setBoundVariable('fontStyle', fontWeightVariable);
            }
          } else if (fontWeightVariable.resolvedType === 'FLOAT') {
            textStyle.setBoundVariable('fontWeight', fontWeightVariable);
          }
        }
      }

      const hasHeadingRows = customRows.some((row: unknown) => String((row as { section?: unknown }).section || '').toLowerCase() === 'heading');
      const hasTextRows = customRows.some((row: unknown) => String((row as { section?: unknown }).section || '').toLowerCase() === 'body');
      if (hasHeadingRows && hasTextRows) {
        figma.notify('Typography Styles Created!');
      } else {
        figma.notify(`${defaultSectionLabel} Styles Created!`);
      }
      return;
    }

    const modesData = JSON.parse(MODES_DATA);
    
    // Extract required typography values from the JSON data
    // Assuming structure: Typography/Font Family/font-family, Typography/Font Weight/regular, Typography/Body/body_xlarge, Typography/Heading/heading_3xlarge
    
    // Helper to find variable value by path
    const getVarValue = (path: string) => {
      const v = modesData.variables.find((v: any) => v.name.toLowerCase() === path.toLowerCase());
      if (v) {
        const val = v.valuesByMode[Object.keys(v.valuesByMode)[0]];
        // Handle alias resolution
        if (typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
          const aliasVar = modesData.variables.find((av: any) => av.id === val.id);
          return aliasVar ? aliasVar.valuesByMode[Object.keys(aliasVar.valuesByMode)[0]] : null;
        }
        return val;
      }
      return null;
    };

    // Load Inter font to avoid errors when creating styles
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Light" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Extra Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Italic" });

    const createTextStyle = async (name: string, sizePath: string, weightName: string, styleName: string, lineHeightPercent: number) => {
      const sizeStr = getVarValue(sizePath);
      if (!sizeStr) return;
      const size = parseFloat(sizeStr);
      if (isNaN(size)) return;

      let textStyle = existingStyles.find(s => s.name === name);
      if (!textStyle) {
        textStyle = figma.createTextStyle();
        textStyle.name = name;
      }
      
      // Ensure the font is loaded before assigning it
      await figma.loadFontAsync({ family: "Inter", style: styleName });
      
      textStyle.fontName = { family: "Inter", style: styleName };
      textStyle.fontSize = size;
      textStyle.lineHeight = { value: lineHeightPercent, unit: 'PERCENT' };
      textStyle.letterSpacing = { value: 0, unit: 'PERCENT' };
    };

    // Headings
    const h3xl = getVarValue('Typography/Heading/heading_3xlarge') || '240';
    await createTextStyle(`Heading/heading-3xlarge - ${h3xl}/100`, 'Typography/Heading/heading_3xlarge', 'Semi Bold', 'Semi Bold', 100);
    const h2xl = getVarValue('Typography/Heading/heading_2xlarge') || '176';
    await createTextStyle(`Heading/heading-2xlarge - ${h2xl}/100`, 'Typography/Heading/heading_2xlarge', 'Semi Bold', 'Semi Bold', 100);
    const hxl = getVarValue('Typography/Heading/heading_xlarge') || '128';
    await createTextStyle(`Heading/heading-xlarge - ${hxl}/100`, 'Typography/Heading/heading_xlarge', 'Semi Bold', 'Semi Bold', 100);
    const hl = getVarValue('Typography/Heading/heading_large') || '96';
    await createTextStyle(`Heading/heading-large - ${hl}/110`, 'Typography/Heading/heading_large', 'Semi Bold', 'Semi Bold', 110);
    const hm = getVarValue('Typography/Heading/heading_medium') || '64';
    await createTextStyle(`Heading/heading-medium - ${hm}/110`, 'Typography/Heading/heading_medium', 'Semi Bold', 'Semi Bold', 110);
    const hs = getVarValue('Typography/Heading/heading_small') || '52';
    await createTextStyle(`Heading/heading-small - ${hs}/120`, 'Typography/Heading/heading_small', 'Semi Bold', 'Semi Bold', 120);
    
    const h1 = getVarValue('Typography/Heading/H1') || '56';
    await createTextStyle(`Heading/H1 - ${h1}/120`, 'Typography/Heading/H1', 'Semi Bold', 'Semi Bold', 120);
    const h2 = getVarValue('Typography/Heading/H2') || '48';
    await createTextStyle(`Heading/H2 - ${h2}/120`, 'Typography/Heading/H2', 'Semi Bold', 'Semi Bold', 120);
    const h3 = getVarValue('Typography/Heading/H3') || '40';
    await createTextStyle(`Heading/H3 - ${h3}/120`, 'Typography/Heading/H3', 'Semi Bold', 'Semi Bold', 120);
    const h4 = getVarValue('Typography/Heading/H4') || '32';
    await createTextStyle(`Heading/H4 - ${h4}/130`, 'Typography/Heading/H4', 'Semi Bold', 'Semi Bold', 130);
    const h5 = getVarValue('Typography/Heading/H5') || '24';
    await createTextStyle(`Heading/H5 - ${h5}/140`, 'Typography/Heading/H5', 'Semi Bold', 'Semi Bold', 140);
    const h6 = getVarValue('Typography/Heading/H6') || '20';
    await createTextStyle(`Heading/H6 - ${h6}/140`, 'Typography/Heading/H6', 'Semi Bold', 'Semi Bold', 140);

    // Text - xLarge
    const createTextVariants = async (folder: string, sizePath: string, lineHeight: number) => {
      const sizeStr = getVarValue(sizePath);
      if (!sizeStr) return;
      await createTextStyle(`${folder}/Light - ${sizeStr}/${lineHeight}`, sizePath, 'Light', 'Light', lineHeight);
      await createTextStyle(`${folder}/Regular - ${sizeStr}/${lineHeight}`, sizePath, 'Regular', 'Regular', lineHeight);
      await createTextStyle(`${folder}/Medium - ${sizeStr}/${lineHeight}`, sizePath, 'Medium', 'Medium', lineHeight);
      await createTextStyle(`${folder}/Semi Bold - ${sizeStr}/${lineHeight}`, sizePath, 'Semi Bold', 'Semi Bold', lineHeight);
      await createTextStyle(`${folder}/Bold - ${sizeStr}/${lineHeight}`, sizePath, 'Bold', 'Bold', lineHeight);
      await createTextStyle(`${folder}/Extra Bold - ${sizeStr}/${lineHeight}`, sizePath, 'Extra Bold', 'Extra Bold', lineHeight);
      await createTextStyle(`${folder}/Italic - ${sizeStr}/${lineHeight}`, sizePath, 'Italic', 'Italic', lineHeight);
    };

    const getFirstExistingPath = (...paths: string[]) => paths.find(path => getVarValue(path)) || '';
    await createTextVariants('Text/xLarge', getFirstExistingPath('Typography/Text/text_xlarge', 'Typography/Body/body_xlarge'), 140);
    await createTextVariants('Text/Large', getFirstExistingPath('Typography/Text/text_large', 'Typography/Body/body_large'), 140);
    await createTextVariants('Text/Medium', getFirstExistingPath('Typography/Text/text_medium', 'Typography/Body/body_medium'), 140);
    await createTextVariants('Text/Default', getFirstExistingPath('Typography/Text/text_default', 'Typography/Body/body_default'), 140);
    await createTextVariants('Text/Small', getFirstExistingPath('Typography/Text/text_small', 'Typography/Body/body_small'), 140);
    await createTextVariants('Text/xSmall', getFirstExistingPath('Typography/Text/text_xsmall', 'Typography/Body/body_xsmall'), 140);

    figma.notify('Text Styles Created!');
  }

  if (msg.type === 'request-token-data') {
    console.log('[code.ts] Received request-token-data from UI');
    
    const modesRaw = MODES_DATA;
    const primitivesRaw = PRIMITIVES_DATA;
    
    const parsedModes = orderCollectionVariables(JSON.parse(modesRaw));
    const parsedPrimitives = orderCollectionVariables(JSON.parse(primitivesRaw));

    // Figma postMessage often fails silently with large JSON payloads.
    // Instead of parsing here, we send the raw JSON strings and let the UI parse them.
    console.log('[code.ts] Sending token-data-response to UI with raw JSON strings');
    figma.ui.postMessage({ 
      type: 'token-data-response', 
      modesRaw: JSON.stringify(parsedModes),
      primitivesRaw: JSON.stringify(parsedPrimitives)
    });
  }

  if (msg.type === 'request-import') {
    try {
      const { modesData, primitivesData } = msg.data || { 
        modesData: JSON.parse(MODES_DATA), 
        primitivesData: JSON.parse(PRIMITIVES_DATA) 
      };
      const normalizedModesData = orderCollectionVariables(modesData);
      const normalizedPrimitivesData = orderCollectionVariables(primitivesData);
      
      const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
      const existingVariables = await figma.variables.getLocalVariablesAsync();

      const hasDuplicate = existingCollections.some(c => 
        (c.name === normalizedModesData.name || c.name === normalizedPrimitivesData.name) && 
        existingVariables.some(v => v.variableCollectionId === c.id)
      );
      
      if (hasDuplicate) {
        figma.notify('Import blocked: Collection with same name already exists', { error: true });
        return;
      }

      figma.notify('Starting import...', { timeout: 1000 });
      
      // Clear the map for fresh import
      variableIdMap.clear();

      // Fetch all existing collections and variables once for optimization
      // const existingVariables = await figma.variables.getLocalVariablesAsync(); // Moved up

      // First pass: Create/Find collections and variables
      const coll1 = await prepareCollection(normalizedPrimitivesData, existingCollections, existingVariables);
      const coll2 = await prepareCollection(normalizedModesData, existingCollections, existingVariables);

      // Refresh variables list after creation
      const allVariables = await figma.variables.getLocalVariablesAsync();

      // Second pass: Set values and resolve aliases
      await applyCollectionValues(normalizedPrimitivesData, coll1, allVariables);
      await applyCollectionValues(normalizedModesData, coll2, allVariables);

      const timestamp = new Date().toLocaleTimeString();
      figma.ui.postMessage({ 
        type: 'status-update', 
        message: 'Import completed!',
        timestamp: timestamp
      });
      figma.notify('Variables imported successfully');
    } catch (error: any) {
      console.error(error);
      figma.notify('Import failed: ' + error.message, { error: true });
      figma.ui.postMessage({ type: 'status-update', message: 'Import failed' });
    }
  }

  if (msg.type === 'merge-styles') {
    figma.notify('Merging styles... (Feature coming soon)');
  }

  if (msg.type === 'run-all') {
    figma.notify('Generating full library...');
  }
};

async function prepareCollection(data: SLCollectionJSON, existingCollections: VariableCollection[], existingVariables: Variable[]) {
  let collection = existingCollections.find(c => c.name === data.name);
  
  if (!collection) {
    collection = figma.variables.createVariableCollection(data.name);
  }
  
  // Handle modes
  const modeIds = Object.keys(data.modes);
  if (modeIds.length > 0) {
    const firstModeId = collection.modes[0].modeId;
    collection.renameMode(firstModeId, data.modes[modeIds[0]]);
    
    for (let i = 1; i < modeIds.length; i++) {
      const modeName = data.modes[modeIds[i]];
      const modeExists = collection.modes.find(m => m.name === modeName);
      if (!modeExists) {
        collection.addMode(modeName);
      }
    }
  }

  // Create variables
  // IMPORTANT: Keep track of insertion order to preserve plugin group layout in Figma
  const orderedIds = Array.isArray(data.variableIds) && data.variableIds.length > 0
    ? data.variableIds
    : data.variables.map((variable) => variable.id);
  const variableById = new Map<string, SLVariableJSON>(data.variables.map((variable) => [variable.id, variable]));
  for (const id of orderedIds) {
    const v = variableById.get(id);
    if (!v) continue;
    let variable = existingVariables.find(varItem => variableIdMap.get(v.id) === varItem.id);
    if (!variable) {
      variable = figma.variables.createVariable(v.name, collection, v.type as VariableResolvedDataType);
      existingVariables.push(variable);
    }
    variableIdMap.set(v.id, variable.id);
  }

  return collection;
}

async function applyCollectionValues(data: SLCollectionJSON, collection: VariableCollection, allVariables: Variable[]) {
  const modeIds = Object.keys(data.modes);
  const collectionModes = collection.modes;

  // Filter variables belonging to this collection once
  const collectionVars = allVariables.filter(v => v.variableCollectionId === collection.id);

  const orderedIds = Array.isArray(data.variableIds) && data.variableIds.length > 0
    ? data.variableIds
    : data.variables.map((variable) => variable.id);
  const variableById = new Map<string, SLVariableJSON>(data.variables.map((variable) => [variable.id, variable]));
  for (const id of orderedIds) {
    const v = variableById.get(id);
    if (!v) continue;
    const mappedVariableId = variableIdMap.get(v.id);
    if (!mappedVariableId) continue;
    const variable = collectionVars.find(varItem => varItem.id === mappedVariableId);

    if (!variable) continue;
    if (v.description) variable.description = v.description;

    modeIds.forEach((oldModeId, index) => {
      const value = v.valuesByMode[oldModeId];
      if (value !== undefined) {
        const targetModeId = collectionModes[index]?.modeId;
        if (!targetModeId) return;

        if (typeof value === 'object' && value !== null && 'type' in value && value.type === 'VARIABLE_ALIAS') {
          const newTargetId = variableIdMap.get(value.id);
          if (newTargetId) {
            variable.setValueForMode(targetModeId, {
              type: 'VARIABLE_ALIAS',
              id: newTargetId
            });
          }
        } else {
          variable.setValueForMode(targetModeId, value);
        }
      }
    });
  }
}
