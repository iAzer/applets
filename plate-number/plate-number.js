
Component({
  data: {
    keyboardShow: false,
    keyboard: 'txt',
    currIndex: '',
    keyTxt: [
      { name: ['粤', '京', '冀', '沪', '津', '晋', '蒙', '辽', '吉', '黑'] },
      { name: ['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '桂'] },
      { name: ['琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁'] }
    ],
    keyNumber: [
      { name: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] },
      { name: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'] },
      { name: ['L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'] }
    ],
    keyNumberBottom: ['W', 'X', 'Y', 'Z'],
    plateNumber: [],
    formatPlateNumber: '',
    plateStatus: false,
    isEnergy: false,
    numberLength: 7,
    numberDisable: false
  },
  methods: {
    _conClick: function(e) {
      this.setData({currIndex: e.currentTarget.dataset.index,keyboardShow: true})

      this._exceptional(this.data.currIndex)
    },
    _keyboardClick: function(e) {
      const currIndex = this.data.currIndex
      const formatIndex = currIndex > this.data.numberLength - 2 ? this.data.numberLength - 1 : currIndex + 1
      this.setData({
        ['plateNumber['+ currIndex +']']: e.currentTarget.dataset.key,
        currIndex: formatIndex
      })

      this._exceptional(this.data.currIndex)
    },
    _clearClick: function() {
      const currIndex = this.data.currIndex
      const formatIndex = currIndex < 1 ? 0 : currIndex - 1
      this.setData({
        ['plateNumber['+ currIndex +']']: '',
        currIndex: formatIndex
      })

      if(this.data.currIndex !== 0) {
        this._exceptional(this.data.currIndex)
      }
    },
    _exceptional: function(index) { //不同键盘状态处理
      // 重置
      if(this.data.keyboard === 'txt') {
        this.setData({keyboard: 'number'})
      }
      if(this.data.numberDisable) {
        this.setData({numberDisable: false})
      }
      if(this.data.keyNumberBottom.length !== 4) {
        this.setData({keyNumberBottom: ['W', 'X', 'Y', 'Z']})
      }
      if(this.data.plateNumber[7] === '') {
        this.data.plateNumber.splice(7, 1)
        this.setData({
          isEnergy: false,
          numberLength: 7
        })
      }

      if(index === 0) { //省份
        this.setData({keyboard: 'txt'})
      }
      if(index === 1) { //限制字母
        this.setData({
          keyboard: 'number',
          numberDisable: true
        })
      }
      if(index === 6) {
        this.setData({keyNumberBottom: ['W', 'X', 'Y', 'Z', '学']})
      }
      if(index === 7){
        this.setData({
          ['plateNumber[7]']: this.data.plateNumber[7] ? this.data.plateNumber[7] : '',
          isEnergy: true,
          numberLength: 8,
          keyNumberBottom: ['W', 'X', 'Y', 'Z', '学']
        })
      }

      this._checkNumber()
    },
    _checkNumber() { //检查输入情况
      let plateNumber = this.data.plateNumber.join('')
      let numberLength = this.data.numberLength
      
      if(plateNumber.length === numberLength && plateNumber !== this.data.formatPlateNumber) {
        this.setData({
          formatPlateNumber: plateNumber,
          plateStatus: true
        })
        this.triggerEvent('plate', { plateNumber: plateNumber });
        return
      }
      if(plateNumber.length !== numberLength && this.data.plateStatus) {
        this.setData({plateStatus: false})
        this.triggerEvent('plate', { plateNumber: false });
      }
    }
  },
  pageLifetimes: {
    show: function() {
      this.setData({keyboardShow: true,currIndex: 0})
    }
  }
})