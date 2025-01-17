export default [
  {
    __config__: {
      label: 'Single line of text',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/en-US/component/input',
      // Regular verification rules
      regList: [{
        pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
        message: 'Malformed phone number'
      }]
    },
    // Component's slot properties
    __slot__: {
      prepend: '',
      append: ''
    },
    __vModel__: 'mobile',
    placeholder: 'Please enter phone number',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': 'el-icon-mobile',
    'suffix-icon': '',
    maxlength: 11,
    'show-word-limit': true,
    readonly: false,
    disabled: false
  }
]
