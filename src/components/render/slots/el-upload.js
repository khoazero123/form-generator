export default {
  'list-type': (h, conf, key) => {
    const list = []
    const config = conf.__config__
    if (conf['list-type'] === 'picture-card') {
      list.push(<i class="el-icon-plus"></i>)
    } else {
      list.push(<el-button size="small" type="primary" icon="el-icon-upload">{config.buttonText}</el-button>)
    }
    if (config.showTip) {
      list.push(
        <div slot="tip" class="el-upload__tip">Can only be uploaded no more than {config.fileSize}{config.sizeUnit} of {conf.accept} file</div>
      )
    }
    return list
  }
}
