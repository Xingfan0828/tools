// "auto";
// console.show(true);
// console.log("调整大小...");
// sleep(1000);
// console.setSize(300, 300);
// sleep(1000);
// console.log("调整位置...");
// console.setPosition(-100, 800);
// sleep(1000);

// 获取用户输入的参数
const nums=80; // 操作图片数量
const huashu='银河国际\n棋牌电子特邀注册就送\n\n首充即送8888元\n官方直营:78game.cc\n凭到账凭证客服申请'
const payPassword="000000"; // 微信支付密码



// 日志时间
let nowdateStr = getNowTimeStr().slice(0,10);
// 设置全局超时和重试逻辑
const maxwait_time = 3000; // 最大等待时间（毫秒）
const RETRY_TIMES = 3; // 最大重试次数
const SLEEP_DURATION = 1000; // 基础等待时间（毫秒）
const paylogpath = "/sdcard/logs/"+nowdateStr+"paylog.txt"; // 日志文件路径
let maxScrollTimes = nums/4+1; // 最多滑动次数，防止死循环
let conts=1; // 滑动次数
let cont=1; // 已操作图片数量
let jine=0.01; // 操作金额
const maxjine=0.05; // 最大操作金额
log("最多滑动次数 maxScrollTimes=" + maxScrollTimes);
/**
 * 重试查找控件
 * @param {UiSelector} selector 查找条件
 * @param {number} times 重试次数
 * @returns {UiObject|null}
 */
function retryFind(selector) {
    for (let i = 0; i < RETRY_TIMES; i++) {
        let obj = selector.findOne(maxwait_time);
        if (obj) return obj;
        sleep(500);
    }
    return null;
}
/**
 * 点击控件中心
 * @param {UiObject} obj
 */
function clickCenter(obj) {
    if (!obj) return false;
    let bounds = obj.bounds();
    let x = bounds.centerX();
    let y = bounds.centerY();
    click(x, y);
    return true;
}

// 获取当前时间字符串
function getNowTimeStr() {
    let now = new Date();
    let yyyy = now.getFullYear();
    let MM = ("0" + (now.getMonth() + 1)).slice(-2);
    let dd = ("0" + now.getDate()).slice(-2);
    let hh = ("0" + now.getHours()).slice(-2);
    let mm = ("0" + now.getMinutes()).slice(-2);
    let ss = ("0" + now.getSeconds()).slice(-2);
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

// 判断微信是否在前台
function isWeChatInForeground() {
    return currentPackage() === "com.tencent.mm";
}

// 输入微信支付密码（模拟点击数字键盘）
function inputPayPassword(password) {
    for (let i = 0; i < password.length; i++) {
        let numBtn = retryFind(text(password[i]));
        if (numBtn) {
            clickCenter(numBtn);
            sleep(300); // 每次点击间隔
        } else {
            toastLog("未找到数字键：" + password[i]);
            // exit();
            back(); back(); back();
            continue;
        }
    }
    toastLog("输入支付密码成功");
}
// 主流程
function mainFlow() {
    // let x=0;
    for (let scrollCount = 1; scrollCount < maxScrollTimes; scrollCount++) {
        for (let i = 0; i < 4; i++) {
            if(cont>nums){
            toastLog("完成所有操作，退出脚本");
            exit();
            }  
            xunhuan=true;
            while (xunhuan) {
                // 如果操作金额>最大金额，重置为0.01
                if(jine > maxjine) jine = 0.01;
                // 启动微信
                $app.launchApp("微信");
                sleep(SLEEP_DURATION);

                // 判断微信是否在前台
                if (!isWeChatInForeground()) {
                    toast("微信未在前台,返回重试");
                    back(); back(); back(); 
                    continue;
                }

                // 1. 打开发现页
                let looks = retryFind(text("发现")); // 等待微信加载完成
                if (!looks) { toastLog("未找到发现按钮，返回重试"); back(); back(); back(); continue; }
                clickCenter(looks);
                sleep(SLEEP_DURATION);

                // 2. 打开 "扫一扫"
                let saoyisao = retryFind(text("扫一扫"));
                if (!saoyisao) { toastLog("未找到扫一扫按钮，返回重试"); back(); back(); back(); continue; }
                clickCenter(saoyisao);
                sleep(2000);

                // 3. 点击 "相册"
                let album = retryFind(text("相册"));
                if (!album) { toastLog("未找到相册按钮，返回重试"); back(); back(); back(); continue; }
                clickCenter(album); log("点击相册成功");
                sleep(SLEEP_DURATION);
                // 3.1 点击相机
                let qiehuan = retryFind(id("gg"));
                if (!qiehuan) { toastLog("未找到切换相机按钮，返回重试"); back(); back(); back(); continue;  }
                clickCenter(qiehuan); log("点击切换相机成功");
                sleep(700);

                // let cameraimages=id("ga2").className("android.widget.TextView").text("相机").findOne();
                let cameraimages=retryFind(id("ga2").className("android.widget.TextView").text("相机"));
                if (!cameraimages) { toastLog("未找到相机图片列表，返回重试"); back(); back(); back(); continue;  }
                clickCenter(cameraimages.parent()); log("点击相机图片列表成功");
                sleep(700);

                // 4. 获取图片列表
                if(conts>0){
                    for (let s = 0; s < conts; s++) {
                        swipe(300, 381, 300, 200, 600);
                    }
                    log("第"+scrollCount+"行,第"+(i+1)+"个");
                }
                sleep(SLEEP_DURATION);

                // 4.1 选择图片
                let images = className("ImageView").find();
                if (!images || images.empty()) {
                    toastLog("未找到图片列表，返回重试");
                    back(); back(); back(); 
                    continue;
                }
                let img = images.get(i);
                let key = img.bounds().toString();
                log(cont+"选择图片：" + key);
                img.parent().click();// 点击父层级
                xunhuan=false;
            }
            cont++;
            sleep(50);

            // 5.填入金额
            let amountInput = retryFind(id("pbn"));
            if (!amountInput) { toastLog("未找到金额输入框");
                // 关闭失效二维码弹窗(back不可用时)
                wzdl=retryFind(text('我知道了'));
                if(wzdl){
                    wzdl.click(); // 关闭选择界面
                    log(getNowTimeStr() + ": 失败 " +(cont-1)+ "\n")
                    continue;
                }else{
                    log(getNowTimeStr() + ": 失败了 " +(cont-1)+ "\n")
                    back(); back(); back();
                    sleep(SLEEP_DURATION);
                    back(); 
                    continue;
                }
            }
            //填入金额
            amountInput.setText(jine);
            toastLog("填入金额成功");
            sleep(SLEEP_DURATION);

            // 6. 点击添加备注
            let clickbeizhu = retryFind(id("luf"));
            if (!clickbeizhu) { toastLog("未找到添加备注按钮");  back();back(); back(); continue;}
            clickCenter(clickbeizhu); 
            log("点击添加备注成功");
            sleep(SLEEP_DURATION);

            // 6.1 填写备注
            let remarkInput = retryFind(id("lwr"));
            if (!remarkInput) { toastLog("未找到备注输入框"); back();back(); back(); continue; }
            remarkInput.setText(huashu); 
            toastLog("添加备注成功");
            click("确定");
            sleep(700);

            // 7.点击付款
            let payButton = retryFind(text("付款").className("android.widget.Button"));
            if (!payButton) { toastLog("未找到付款按钮");back();back(); back(); continue; }
            clickCenter(payButton); 
            log("点击付款成功");
            sleep(SLEEP_DURATION);

            // 输入密码前异常情况
            let mimakuang = desc("密码框,共六位数字,已输入0位").findOne(3000);
            let continuePay = text("继续支付").findOne(500);
            let dongtai = text("识别并支付").findOne(500);
            let wzdl=text('我知道了').findOne(500);
            let jyxz=text('取消').findOne(500);
            switch(true){
                case dongtai !==null:
                    dongtai.click();
                    sleep(500);
                    toastLog("检测到支付密码界面，开始输入密码");
                    inputPayPassword(payPassword);
                    sleep(2000);
                    break;
                // 无异常输入密码
                case mimakuang !==null:
                    toastLog("检测到支付密码界面，开始输入密码");
                    inputPayPassword(payPassword);
                    sleep(2000);
                    break;
                case continuePay !==null:
                    continuePay.click();
                    sleep(500);      
                    // 点击后立即检查密码框
                    toastLog("检测到支付密码界面，开始输入密码");
                    inputPayPassword(payPassword);
                    sleep(2000);
                    break;
                case wzdl !==null:
                    wzdl.click(); // 关闭选择界面
                    toastLog("二维码异常关闭");
                    log(getNowTimeStr() + ": 失败 " +(cont-1)+ "\n")
                    back(); back(); back(); 
                    continue;
                case jyxz !==null:
                    jyxz.click(); // 关闭选择界面
                    toastLog("对方交易限制");
                    log(getNowTimeStr() + ": 失败 " +(cont-1)+ "\n")
                    back(); back(); back(); 
                    continue;
            }

            // 输入密码后异常情况

            let confirmBtn = desc("完成").findOne(1500);
            let jiaoyi=text("关闭").findOne(500);
            let yczdl=text("我知道了").findOne(500);
            qd1=text('确定').findOne(500);
            switch(true){
                // 无异常完成支付
                case confirmBtn !=null:
                    clickCenter(confirmBtn);
                    toastLog("点击完成成功");
                    files.append(paylogpath, getNowTimeStr() + ": 成功 " +(cont-1)+ "\n");
                    log(getNowTimeStr() + ": 成功 " +(cont-1)+ "\n")
                    jine=jine+0.01; // 每次增加0.01
                    sleep(SLEEP_DURATION);
                    break;
                // 限制交易100笔
                case jiaoyi !=null:
                    jiaoyi.click(); // 关闭选择界面
                    // toastLog("交易限制100笔,此账号已经全部完成"); 
                    toastLog("对方账户违规，返回重试");
                    back(); back(); back();
                    // exit();
                    continue;
                case yczdl !=null:
                    yczdl.click(); // 关闭选择界面
                    toastLog("对方交易异常");
                    log(getNowTimeStr() + ": 失败 " +(cont-1)+ "\n")    
                    back(); back(); back(); 
                    continue;
                case qd1 !=null:
                    qd1.click(); // 关闭选择界面
                    toastLog("支付失败");
                    // files.append(paylogpath, getNowTimeStr() + ": 失败 " +(cont-1)+ "\n");
                    log(getNowTimeStr() + ": 失败 " +(cont-1)+ "\n")
                    back(); back(); back(); 
                    continue;
            }

        }
        conts++;
    }

}

mainFlow();