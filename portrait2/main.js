var EditPortrait = function(){
    this.init()
}
EditPortrait.prototype = {
    init: function(){
        this.area = $('main')
        this.getImg = $('.getImg')
        this.bgImg = $('.bgImg')
        this.editImg = $('.editImg')
        this.finalImg = $('.finalImg img')
        this.saveImg = $('input[type="button"]')
        this.clipAreaX = 20  //左上角顶点的x坐标
        this.clipAreaY = 20  //左上角顶点的y坐标
        this.clipWidth = 160  //修剪图片的宽，后期调用可更改
        this.clipHeight = 160  //修剪图片的高，后期调用可更改
        var _this = this
        $('input[type="file"]').addEventListener('change',function(e){
            _this.readFile(e.target.files[0])  
            _this.saveImage() //上传过图片才能点击保存
        })
    },
    readFile: function(file) {  //读取文件到内存
        var reader = new FileReader(),
            _this = this
        reader.readAsDataURL(file)
        reader.onload = function (e) {
            _this.applyDataUrlToCanvas(reader.result);
        }
    },
    applyDataUrlToCanvas: function(result){  //把图片添加到canvas
        var _this = this,
            getImgCtx = this.getImg.getContext('2d'),
            img = new Image(),
            areaW = this.area.offsetWidth,
            areaH = this.area.offsetHeight
        img.src = result
        img.onload = function(){
            if(img.width < areaW && img.height < areaH){  
                _this.imgWidth = img.width
                _this.imgHeight = img.height
            }else{
                var bgWidth = img.width / (img.height / areaH),//获取等比例区域大小图片，防止改变图片比例
                    bgHeight = img.height / (img.width / areaW)
                _this.imgWidth = img.width > img.height ? areaW : bgWidth 
                _this.imgHeight = img.height > img.width ? areaH : bgHeight
            }
            _this.getImg.width = _this.imgWidth  //填充整个getImg区域
            _this.getImg.height = _this.imgHeight
            getImgCtx.drawImage(img,0,0,_this.imgWidth,_this.imgHeight)
            _this.imgUrl = _this.getImg.toDataURL() //获取图片的base64
            _this.clipImg()
            _this.drawImg()
        }
    },
    clipImg: function(){  //获取修剪区域
        this.bgImg.width = this.imgWidth
        this.bgImg.height = this.imgHeight
        this.bgImg.style.display = 'block'  //蒙阴层显现

        var bgImgCtx = this.bgImg.getContext('2d')
        bgImgCtx.fillStyle = 'rgba(0,0,0,0.6)'
        bgImgCtx.fillRect(0,0, this.imgWidth,this.imgHeight) //覆盖整个getImg
        bgImgCtx.clearRect(this.clipAreaX,this.clipAreaY,this.clipWidth,this.clipHeight)  //清除这个区域的内容
    },
    drawImg: function(){
        var draging = false,
            startX = 0,
            startY = 0,
            _this = this
        this.bgImg.addEventListener('mousemove',function(e){
            var pageX = e.pageX - (_this.area.offsetLeft + this.offsetLeft),
                pageY = e.pageY - (_this.area.offsetTop + this.offsetTop)
            if ( pageX > _this.clipAreaX && pageX < _this.clipAreaX + _this.clipWidth && pageY > _this.clipAreaY && pageY < _this.clipAreaY + _this.clipHeight ){
                this.style.cursor = 'move'
                this.onmousedown = function(){
                    draging = true
                    _this.ex =  _this.clipAreaX
                    _this.ey =  _this.clipAreaY
                    startX = e.pageX - ( _this.area.offsetLeft + this.offsetLeft );
                    startY = e.pageY - ( _this.area.offsetTop + this.offsetTop );
                }
                window.onmouseup = function() {
                    draging = false
                }
                if(draging){
                    if( _this.ex + (pageX - startX) < 0 ) {
                        _this.clipAreaX = 0
                    }else if( _this.ex + (pageX - startX) + _this.clipWidth > _this.imgWidth) {
                        _this.clipAreaX = _this.imgWidth - _this.clipWidth
                    }else{
                        _this.clipAreaX = _this.ex + (pageX - startX)
                    }
                    if (_this.ey + (pageY - startY) < 0) {
                        _this.clipAreaY = 0
                    } else if ( _this.ey + (pageY - startY) + _this.clipHeight > _this.imgHeight ) {
                        _this.clipAreaY = _this.imgHeight - _this.clipHeight
                    } else {
                        _this.clipAreaY = _this.ey + (pageY - startY)
                    }
                    _this.clipImg()
                }
            }else{
                this.style.cursor = 'auto'
            }
        })
    },
    saveImage: function(){
        var _this = this
        this.saveImg.addEventListener('click',function(){
            _this.editImg.width = _this.clipWidth
            _this.editImg.height = _this.clipHeight
            var editImgCtx = _this.editImg.getContext('2d')
            var img = new Image()
            img.src = _this.imgUrl
            img.onload = function(){
                editImgCtx.drawImage(img,_this.clipAreaX,_this.clipAreaY,_this.clipWidth,_this.clipHeight,0,0,_this.clipWidth,_this.clipHeight)
                _this.finalImg.src = _this.editImg.toDataURL()
            }
        })
    }
}
function $(id){
    return document.querySelector(id)
}