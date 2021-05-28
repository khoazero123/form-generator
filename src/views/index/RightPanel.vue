<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="Component properties" name="field" />
      <el-tab-pane label="Form attribute" name="form" />
    </el-tabs>
    <div class="field-box">
      <a class="document-link" target="_blank" :href="documentLink" title="View component documentation">
        <i class="el-icon-link" />
      </a>
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="90px">
          <el-form-item v-if="activeData.__config__.changeTag" label="Component type">
            <el-select
              v-model="activeData.__config__.tagIcon"
              placeholder="Please select the component type"
              :style="{width: '100%'}"
              @change="tagChange"
            >
              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.__config__.label"
                  :label="item.__config__.label"
                  :value="item.__config__.tagIcon"
                >
                  <svg-icon class="node-icon" :icon-class="item.__config__.tagIcon" />
                  <span> {{ item.__config__.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.__vModel__!==undefined" label="Field name">
            <el-input v-model="activeData.__vModel__" placeholder="Please enter a field name （v-model）" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.componentName!==undefined" label="Component name">
            {{ activeData.__config__.componentName }}
          </el-form-item>
          <el-form-item v-if="activeData.__config__.label!==undefined" label="Title">
            <el-input v-model="activeData.__config__.label" placeholder="Please enter the title" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder!==undefined" label="Placeholder tips">
            <el-input v-model="activeData.placeholder" placeholder="Please enter the placeholder prompt" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData['start-placeholder']!==undefined" label="Start placement">
            <el-input v-model="activeData['start-placeholder']" placeholder="Please enter the placeholder prompt" />
          </el-form-item>
          <el-form-item v-if="activeData['end-placeholder']!==undefined" label="End placeholder">
            <el-input v-model="activeData['end-placeholder']" placeholder="Please enter the placeholder prompt" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.span!==undefined" label="Form grid">
            <el-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.gutter!==undefined" label="Grid interval">
            <el-input-number v-model="activeData.gutter" :min="0" placeholder="Grid interval" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.type!==undefined" label="Layout mode">
            <el-radio-group v-model="activeData.type">
              <el-radio-button label="default" />
              <el-radio-button label="flex" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="Horizontal arrangement">
            <el-select v-model="activeData.justify" placeholder="Please select horizontal arrangement" :style="{width: '100%'}">
              <el-option
                v-for="(item, index) in justifyOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="Vertical arrangement">
            <el-radio-group v-model="activeData.align">
              <el-radio-button label="top" />
              <el-radio-button label="middle" />
              <el-radio-button label="bottom" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.labelWidth!==undefined" label="Label width">
            <el-input v-model.number="activeData.__config__.labelWidth" type="number" placeholder="Please enter the label width" />
          </el-form-item>
          <el-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="Component width">
            <el-input v-model="activeData.style.width" placeholder="Please enter the component width" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.__vModel__!==undefined" label="Defaults">
            <el-input
              :value="setDefaultValue(activeData.__config__.defaultValue)"
              placeholder="Please enter the default value"
              @input="onDefaultValueInput"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="At least">
            <el-input-number
              :value="activeData.min"
              :min="0"
              placeholder="At least"
              @input="$set(activeData, 'min', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="Up to you can choose">
            <el-input-number
              :value="activeData.max"
              :min="0"
              placeholder="Up to you can choose"
              @input="$set(activeData, 'max', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__slot__&&activeData.__slot__.prepend!==undefined" label="Prefix">
            <el-input v-model="activeData.__slot__.prepend" placeholder="Please enter a prefix" />
          </el-form-item>
          <el-form-item v-if="activeData.__slot__&&activeData.__slot__.append!==undefined" label="suffix">
            <el-input v-model="activeData.__slot__.append" placeholder="Please enter a suffix" />
          </el-form-item>
          <el-form-item v-if="activeData['prefix-icon']!==undefined" label="Front icon">
            <el-input v-model="activeData['prefix-icon']" placeholder="Please enter the front icon name">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                select
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="After the icon">
            <el-input v-model="activeData['suffix-icon']" placeholder="Please enter the icon name">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                select
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="activeData['icon']!==undefined && activeData.__config__.tag === 'el-button'"
            label="Button icon"
          >
            <el-input v-model="activeData['icon']" placeholder="Please enter the button icon name">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
                select
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Option separator">
            <el-input v-model="activeData.separator" placeholder="Please enter the option separator" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="Minorize line">
            <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="Minorize line" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="Maximum number of lines">
            <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="Maximum number of lines" />
          </el-form-item>
          <el-form-item v-if="isShowMin" label="Minimum">
            <el-input-number v-model="activeData.min" placeholder="Minimum" />
          </el-form-item>
          <el-form-item v-if="isShowMax" label="Maximum">
            <el-input-number v-model="activeData.max" placeholder="Maximum" />
          </el-form-item>
          <el-form-item v-if="activeData.height!==undefined" label="Component height">
            <el-input-number v-model="activeData.height" placeholder="height" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="isShowStep" label="步长">
            <el-input-number v-model="activeData.step" placeholder="Step count" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="accuracy">
            <el-input-number v-model="activeData.precision" :min="0" placeholder="accuracy" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="Button position">
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button label="">
                default
              </el-radio-button>
              <el-radio-button label="right">
                Right
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.maxlength !== undefined" label="Up to enter">
            <el-input v-model="activeData.maxlength" placeholder="Please enter the character length">
              <template slot="append">
                Character
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['active-text'] !== undefined" label="Open prompt">
            <el-input v-model="activeData['active-text']" placeholder="Please enter the prompt" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-text'] !== undefined" label="Close prompt">
            <el-input v-model="activeData['inactive-text']" placeholder="Please enter a closed prompt" />
          </el-form-item>
          <el-form-item v-if="activeData['active-value'] !== undefined" label="Open value">
            <el-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="Please enter the open value"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-value'] !== undefined" label="Shut down">
            <el-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="Please enter a closed value"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item>
          <el-form-item
            v-if="activeData.type !== undefined && 'el-date-picker' === activeData.__config__.tag"
            label="Time type"
          >
            <el-select
              v-model="activeData.type"
              placeholder="Please select time type"
              :style="{ width: '100%' }"
              @change="dateTypeChange"
            >
              <el-option
                v-for="(item, index) in dateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.name !== undefined" label="File field name">
            <el-input v-model="activeData.name" placeholder="Please enter the upload file field name" />
          </el-form-item>
          <el-form-item v-if="activeData.accept !== undefined" label="file type">
            <el-select
              v-model="activeData.accept"
              placeholder="Please select the file type"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option label="image" value="image/*" />
              <el-option label="video" value="video/*" />
              <el-option label="Audio" value="audio/*" />
              <el-option label="excel" value=".xls,.xlsx" />
              <el-option label="word" value=".doc,.docx" />
              <el-option label="pdf" value=".pdf" />
              <el-option label="txt" value=".txt" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.fileSize !== undefined" label="File size">
            <el-input v-model.number="activeData.__config__.fileSize" placeholder="Please enter the file size">
              <el-select slot="append" v-model="activeData.__config__.sizeUnit" :style="{ width: '66px' }">
                <el-option label="KB" value="KB" />
                <el-option label="MB" value="MB" />
                <el-option label="GB" value="GB" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.action !== undefined" label="Upload address">
            <el-input v-model="activeData.action" placeholder="Please enter the upload address" clearable />
          </el-form-item>
          <el-form-item v-if="activeData['list-type'] !== undefined" label="List type">
            <el-radio-group v-model="activeData['list-type']" size="small">
              <el-radio-button label="text">
                text
              </el-radio-button>
              <el-radio-button label="picture">
                picture
              </el-radio-button>
              <el-radio-button label="picture-card">
                picture-card
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.type !== undefined && activeData.__config__.tag === 'el-button'"
            label="按钮类型"
          >
            <el-select v-model="activeData.type" :style="{ width: '100%' }">
              <el-option label="primary" value="primary" />
              <el-option label="success" value="success" />
              <el-option label="warning" value="warning" />
              <el-option label="danger" value="danger" />
              <el-option label="info" value="info" />
              <el-option label="text" value="text" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.buttonText !== undefined"
            v-show="'picture-card' !== activeData['list-type']"
            label="Button writing"
          >
            <el-input v-model="activeData.__config__.buttonText" placeholder="Please enter the button text" />
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.tag === 'el-button'"
            label="Button writing"
          >
            <el-input v-model="activeData.__slot__.default" placeholder="Please enter the button text" />
          </el-form-item>
          <el-form-item v-if="activeData['range-separator'] !== undefined" label="Separator">
            <el-input v-model="activeData['range-separator']" placeholder="Please enter a separator" />
          </el-form-item>
          <el-form-item v-if="activeData['picker-options'] !== undefined" label="period">
            <el-input
              v-model="activeData['picker-options'].selectableRange"
              placeholder="Please enter the time period"
            />
          </el-form-item>
          <el-form-item v-if="activeData.format !== undefined" label="Time format">
            <el-input
              :value="activeData.format"
              placeholder="Please enter the time format"
              @input="setTimeValue($event)"
            />
          </el-form-item>
          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.__config__.tag) > -1">
            <el-divider>Option</el-divider>
            <draggable
              :list="activeData.__slot__.options"
              :animation="340"
              group="selectItem"
              handle=".option-drag"
            >
              <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation" />
                </div>
                <el-input v-model="item.label" placeholder="Option name" size="small" />
                <el-input
                  placeholder="Option value"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                />
                <div class="close-btn select-line-icon" @click="activeData.__slot__.options.splice(index, 1)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <el-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addSelectItem"
              >
                Add option
              </el-button>
            </div>
            <el-divider />
          </template>

          <template v-if="['el-cascader', 'el-table'].includes(activeData.__config__.tag)">
            <el-divider>Option</el-divider>
            <el-form-item v-if="activeData.__config__.dataType" label="type of data">
              <el-radio-group v-model="activeData.__config__.dataType" size="small">
                <el-radio-button label="dynamic">
                  dynamic data
                </el-radio-button>
                <el-radio-button label="static">
                  Static data
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <template v-if="activeData.__config__.dataType === 'dynamic'">
              <el-form-item label="interface address">
                <el-input
                  v-model="activeData.__config__.url"
                  :title="activeData.__config__.url"
                  placeholder="Please enter the interface address"
                  clearable
                  @blur="$emit('fetch-data', activeData)"
                >
                  <el-select
                    slot="prepend"
                    v-model="activeData.__config__.method"
                    :style="{width: '85px'}"
                    @change="$emit('fetch-data', activeData)"
                  >
                    <el-option label="get" value="get" />
                    <el-option label="post" value="post" />
                    <el-option label="put" value="put" />
                    <el-option label="delete" value="delete" />
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="Data location">
                <el-input
                  v-model="activeData.__config__.dataPath"
                  placeholder="Please enter the data location"
                  @blur="$emit('fetch-data', activeData)"
                />
              </el-form-item>

              <template v-if="activeData.props && activeData.props.props">
                <el-form-item label="Label key name">
                  <el-input v-model="activeData.props.props.label" placeholder="Please enter the label key name" />
                </el-form-item>
                <el-form-item label="Value key name">
                  <el-input v-model="activeData.props.props.value" placeholder="Please enter the value key name" />
                </el-form-item>
                <el-form-item label="Child key name">
                  <el-input v-model="activeData.props.props.children" placeholder="Please enter a child name" />
                </el-form-item>
              </template>
            </template>

            <!-- 级联选择静态树 -->
            <el-tree
              v-if="activeData.__config__.dataType === 'static'"
              draggable
              :data="activeData.options"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
            <div v-if="activeData.__config__.dataType === 'static'" style="margin-left: 20px">
              <el-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addTreeItem"
              >
                Add parent
              </el-button>
            </div>
            <el-divider />
          </template>

          <el-form-item v-if="activeData.__config__.optionType !== undefined" label="Option style">
            <el-radio-group v-model="activeData.__config__.optionType">
              <el-radio-button label="default">
                default
              </el-radio-button>
              <el-radio-button label="button">
                Button
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['active-color'] !== undefined" label="Open color">
            <el-color-picker v-model="activeData['active-color']" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-color'] !== undefined" label="Close color">
            <el-color-picker v-model="activeData['inactive-color']" />
          </el-form-item>

          <el-form-item v-if="activeData.__config__.showLabel !== undefined
            && activeData.__config__.labelWidth !== undefined" label="Display label"
          >
            <el-switch v-model="activeData.__config__.showLabel" />
          </el-form-item>
          <el-form-item v-if="activeData.branding !== undefined" label="Brand brand">
            <el-switch v-model="activeData.branding" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData['allow-half'] !== undefined" label="Allow half">
            <el-switch v-model="activeData['allow-half']" />
          </el-form-item>
          <el-form-item v-if="activeData['show-text'] !== undefined" label="Show text writing">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-score'] !== undefined" label="Display score">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-stops'] !== undefined" label="Display breakpoint">
            <el-switch v-model="activeData['show-stops']" />
          </el-form-item>
          <el-form-item v-if="activeData.range !== undefined" label="Range">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.border !== undefined && activeData.__config__.optionType === 'default'"
            label="Whether with a border"
          >
            <el-switch v-model="activeData.__config__.border" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-color-picker'" label="Color format">
            <el-select
              v-model="activeData['color-format']"
              placeholder="Please select a color format"
              :style="{ width: '100%' }"
              clearable
              @change="colorFormatChange"
            >
              <el-option
                v-for="(item, index) in colorFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeData.size !== undefined &&
              (activeData.__config__.optionType === 'button' ||
                activeData.__config__.border ||
                activeData.__config__.tag === 'el-color-picker' ||
                activeData.__config__.tag === 'el-button')"
            label="Component size"
          >
            <el-radio-group v-model="activeData.size">
              <el-radio-button label="medium">
                medium
              </el-radio-button>
              <el-radio-button label="small">
                small
              </el-radio-button>
              <el-radio-button label="mini">
                mini
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="Enter statistics">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="Strict way">
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Optional level">
            <el-switch v-model="activeData.props.props.checkStrictly" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Whether it is more">
            <el-switch v-model="activeData.props.props.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Display full path">
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Can you filter?">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.clearable !== undefined" label="Can you empty?">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.showTip !== undefined" label="Show prompt">
            <el-switch v-model="activeData.__config__.showTip" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-upload'" label="Multi-selection file">
            <el-switch v-model="activeData.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData['auto-upload'] !== undefined" label="Automatic upload">
            <el-switch v-model="activeData['auto-upload']" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" label="Whether you read">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" label="Is it disabled?">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="Can you search?">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="Whether it is more">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.required !== undefined" label="Whether it will be filled">
            <el-switch v-model="activeData.__config__.required" />
          </el-form-item>

          <template v-if="activeData.__config__.layoutTree">
            <el-divider>Layout tree</el-divider>
            <el-tree
              :data="[activeData.__config__]"
              :props="layoutTreeProps"
              node-key="renderKey"
              default-expand-all
              draggable
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon class="node-icon" :icon-class="data.__config__?data.__config__.tagIcon:data.tagIcon" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </template>

          <template v-if="Array.isArray(activeData.__config__.regList)">
            <el-divider>Regular verification</el-divider>
            <div
              v-for="(item, index) in activeData.__config__.regList"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="expression">
                <el-input v-model="item.pattern" placeholder="Please enter the regular" />
              </el-form-item>
              <el-form-item label="Error message" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="Please enter an error message" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                Add rule
              </el-button>
            </div>
          </template>
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="Form name">
            <el-input v-model="formConf.formRef" placeholder="Please enter a form name （ref）" />
          </el-form-item>
          <el-form-item label="Form model">
            <el-input v-model="formConf.formModel" placeholder="Please enter a data model" />
          </el-form-item>
          <el-form-item label="Calibration model">
            <el-input v-model="formConf.formRules" placeholder="Please enter the verification model" />
          </el-form-item>
          <el-form-item label="Form size">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">
                medium
              </el-radio-button>
              <el-radio-button label="small">
                small
              </el-radio-button>
              <el-radio-button label="mini">
                mini
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Label alignment">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                Left alignment
              </el-radio-button>
              <el-radio-button label="right">
                Right alignment
              </el-radio-button>
              <el-radio-button label="top">
                Top alignment
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Label width">
            <el-input v-model.number="formConf.labelWidth" type="number" placeholder="Please enter the label width" />
          </el-form-item>
          <el-form-item label="Grid interval">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="Grid interval" />
          </el-form-item>
          <el-form-item label="Disable form">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="Form button">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="Display unselected component border">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="Add option" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
  </div>
</template>

<script>
import { isArray } from 'util'
import TreeNodeDialog from '@/views/index/TreeNodeDialog'
import { isNumberStr } from '@/utils/index'
import IconsDialog from './IconsDialog'
import {
  inputComponents, selectComponents, layoutComponents
} from '@/components/generator/config'
import { saveFormConf } from '@/utils/db'

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ['tinymce']

export default {
  components: {
    TreeNodeDialog,
    IconsDialog
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [
        {
          label: 'date',
          value: 'date'
        },
        {
          label: 'week',
          value: 'week'
        },
        {
          label: 'month',
          value: 'month'
        },
        {
          label: 'year',
          value: 'year'
        },
        {
          label: 'datetime',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: 'daterange',
          value: 'daterange'
        },
        {
          label: 'monthrange',
          value: 'monthrange'
        },
        {
          label: 'datetimerange',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__
          return data.componentName || `${config.label}: ${data.__vModel__}`
        }
      }
    }
  },
  computed: {
    documentLink() {
      return (
        this.activeData.__config__.document
        || 'https://element.eleme.cn/#/en-US/component/installation'
      )
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined
        && this.activeData.__config__.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
    tagList() {
      return [
        {
          label: 'Input component',
          options: inputComponents
        },
        {
          label: 'Selective component',
          options: selectComponents
        }
      ]
    },
    activeTag() {
      return this.activeData.__config__.tag
    },
    isShowMin() {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1
    },
    isShowMax() {
      return ['el-input-number', 'el-slider', 'el-rate'].indexOf(this.activeTag) > -1
    },
    isShowStep() {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val)
      },
      deep: true
    }
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: ''
      })
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        label: '',
        value: ''
      })
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)}
              class="el-icon-plus"
              title="Add to"
            ></i>
            <i on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="delete"
            ></i>
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = [] // 避免删除时报错
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          isNumberStr(str) ? +str : str
        )
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData.__config__, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    spanChange(val) {
      this.formConf.span = val
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.__config__.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.__config__.renderKey = +new Date() // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.__config__.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.__config__.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
</style>
