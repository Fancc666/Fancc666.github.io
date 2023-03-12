/***
 * 20211106-v0.1
 * 20211107-new-v0.11
 * 20220313-new-v0.2
 */

/***
 * Author: Fancc
 * Bilibili: 358578749
 */

// start
// console.log("Hello.%c Nice to meet you.\n%cThis tool is better than vconsole!", "color:green", "color:red");

// func
// 跨域加载api
let api_response;
function load_script(url, f){
    setTimeout(function(){
        let s = document.createElement("script");
        s.src = url;
        document.querySelector("body").appendChild(s);
        s.onload = function(){
            s.remove();
            f();
        };
        s.onerror = function(){
            s.remove();
            api_response={"code": 0, "msg": "网络错误"};
            f();
        }
    }, 0);
}

// hide if img loaded error
let head_img = document.getElementsByClassName("back-img")[0].children[0];
let warn = document.getElementById("warn");
function check_img(){
    if (head_img.naturalWidth === 0){// when img load err its width would be 0
        head_img.parentElement.classList.add("hide");// hide the img
    }
}

// check theme and img // we do not use it now.20220313
// set_theme();// black and white theme for users
window.onload = function (){
    check_img();// check img when elements are ready
}

// warn and its mask
function show_warn(i){
    document.getElementById("wcontent").innerHTML = i;
    document.getElementById("mask").classList.remove("hide");
    // console.log(window.scrollY);
    // document.getElementById("mask").style.top = String(window.scrollY);
    document.documentElement.style.overflow = "hidden";
}
function hide_warn(){
    document.getElementById("mask").classList.add("hide");
    document.documentElement.style.overflow = "auto";
}
document.getElementById("mask").addEventListener("click", hide_warn);

// button and jump to the url
document.getElementById("go").addEventListener("click", function (){
    let link = document.getElementById("dlink").value;// the link
    // let ji = document.getElementById("dji").value;// season
    // let qi = document.getElementById("dqi").value;// episode
    // let qtitle = document.getElementById("qtitle").value;// qtitle
    // if (link && (qtitle || (ji && qi))){
    //     if (ji && qi){
    //         window.open(`https://fancc666.gitee.io/say/dxx/index.html?t=${ji},${qi}&l=${link}`);
    //     }else {
    //         window.open(`https://fancc666.gitee.io/say/dxx/index.html?l=${link}&qtitle=${qtitle}`);
    //     }
    // }else {
    //     show_warn("参数错误");// show warn while nothing has been input
    // }

    // 2023 code
    warn.innerHTML = "加载中，请稍后";
    load_script(
        url = "https://api.565455.xyz/api/title/?link=" + link,
        // url = "http://127.0.0.1:8888/?bv=" + l + "&p=" + p,
        f = function(){
            if (!api_response['code']){
                // 成功
                console.log(api_response['title']);
                window.open(`https://fancc666.gitee.io/say/dxx/index.html?l=${link}&qtitle=${api_response['title']}`);
                warn.innerHTML = "";
                //
            }else{
                // 失败
                console.log(api_response['msg']);
                warn.innerHTML = "失败:"+api_response['msg'];
            }
        }
    );
});

// theme
// theme_a is black
// theme_b is white
// default: theme_b
/*
document.getElementById("theme_a").addEventListener("click", function (){
    theme_a();
});
document.getElementById("theme_b").addEventListener("click", function (){
    theme_b();
});
 */
// remember theme
/*function theme_a(){
    document.documentElement.style.backgroundColor = "gray";
    document.documentElement.style.color = "white";
    head_img.parentElement.classList.add("hide");
    window.localStorage.setItem("theme", "a");
}
function theme_b(){
    document.documentElement.style.backgroundColor = "white";
    document.documentElement.style.color = "black";
    head_img.parentElement.classList.remove("hide");
    window.localStorage.setItem("theme", "b");
}
// set theme when it start
// theme save in localStorage
function set_theme(){
    if (window.localStorage.getItem("theme") === null){
        window.localStorage.setItem("theme", "b");// set default when user view at the first time
    }
    let theme = window.localStorage.getItem("theme");
    if (theme === "a"){
        theme_a();
    }
    if (theme === "b"){
        theme_b();
    }
}
*/