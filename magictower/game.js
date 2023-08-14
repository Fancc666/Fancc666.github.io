/**
 * author: FANCC
 * 2023.8.14
 * magic tower engine
 */
var game = game || {};
game.item = null;
game.colorBars = [];
game.gameID = 1;
game.end = false;
game.debugMode = false;
game.get_item = (id)=>{
    // game.item = document.getElementById(id);
    game.item = document.querySelector(id);
    return game.item;
}
game.get_items = (id)=>{
    // game.item = document.getElementById(id);
    // game.item = document.querySelectorAll(id);
    return document.querySelectorAll(id);
}
game.hide_page = (id)=>{
    game.get_item(id);
    game.item.classList.remove("active");
}
game.show_page = (id)=>{
    game.get_item(id);
    game.item.classList.add("active");
}
game.rule = null
game.click_bar = (index)=>{
    // game.item = element;
    // console.log(element, game.colorBars);
    for (let i=0;i<game.rule[index].length;i++){
        if (game.rule[index][i]){
            game.change_color(i);
        }
    }
}
game.change_color = (index)=>{
    let nowColor = Number(game.colorBars[index].attributes.color.value);
    let newColor = (nowColor + 1) % 4;
    game.colorBars[index].attributes.color.value = String(newColor);
    game.colorBars[index].classList.remove(`color${nowColor}`);
    game.colorBars[index].classList.add(`color${newColor}`);
}
game.initColor = ()=>{
    for (let i=0;i<game.colorBars.length;i++){
        for (let j=0;j<4;j++){
            game.colorBars[i].classList.remove(`color${j}`);
        }
    }
    for (let i=0;i<game.colorBars.length;i++){
        game.colorBars[i].classList.add(`color${game.data[game.gameID].initColor[i]}`);
        game.colorBars[i].attributes.color.value = String(game.data[game.gameID].initColor[i]);
    }
}
game.init_all = ()=>{
    game.get_item("#gameID").innerText = String(game.gameID);
    game.initColor();
    game.get_item("#tip").innerText = game.data[game.gameID].tip;
    game.rule = game.data[game.gameID].rule;
}
game.checkNext = ()=>{
    let flag = 0;
    for (let i=0;i<game.colorBars.length;i++){
        if (game.colorBars[i].attributes.color.value === "0"){
            flag += 1;
        }
    }
    if (flag < 4 && !game.debugMode){
        alert("您还未完成谜题");
    }else{
        game.next();
    }
}
game.next = ()=>{
    if (!game.end){
        game.gameID += 1;
        if (game.data[game.gameID] === undefined){
            alert("恭喜通关！没有更多关卡了");
            game.end = true;
        }else{
            game.init_all();
            // 记录进度
            if (localStorage.getItem("game_process") === null || Number(localStorage.getItem("game_process")) < game.gameID){
                localStorage.setItem("game_process", game.gameID);
            }
        }
    }
}
game.start_game = ()=>{
    game.hide_page("#welcome");
    game.show_page("#game");
    game.get_items(".colorbar").forEach((e)=>{
        game.colorBars.push(e);
        e.addEventListener("click", ()=>{game.click_bar(e.attributes.floor.value)});
    });
    game.init_all();
}
game.load_process = ()=>{
    if (localStorage.getItem("game_process") === null){
        alert("未找到进度记录");
    }else{
        game.gameID = Number(localStorage.getItem("game_process"));
        game.start_game();
    }
}

// data
game.data = {
    1: {
        initColor: [0, 1, 2, 3],
        rule: [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ],
        tip: "黄蓝绿红，循环中是魔塔的奥秘，简单的规则不会继续下去……"
    },
    2: {
        initColor: [1, 1, 2, 2],
        rule: [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [1, 0, 0, 1]
        ],
        tip: "规则在变化，也许又不曾改变"
    },
    3: {
        initColor: [1, 2, 3, 2],
        rule: [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [1, 0, 0, 1]
        ],
        tip: ""
    },
    4: {
        initColor: [1, 0, 2, 1],
        rule: [
            [1, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [1, 0, 0, 1]
        ],
        tip: "变幻莫测，层层递进……"
    },
    5: {
        initColor: [2, 2, 3, 1],
        rule: [
            [1, 0, 1, 1],
            [0, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 0, 0, 1]
        ],
        tip: "如果你会矩阵，问题会迎刃而解……"
    },
    6: {
        initColor: [1, 2, 1, 1],
        rule: [
            [1, 0, 1, 1],
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 1, 1]
        ],
        tip: "如果你会矩阵，问题会迎刃而解……"
    },
    7: {
        initColor: [3, 3, 3, 3],
        rule: [
            [1, 1, 0, 0],
            [0, 1, 1, 1],
            [0, 1, 1, 0],
            [0, 1, 0, 1]
        ],
        tip: "硬试的话，能否成功呢？"
    },
    8: {
        initColor: [2, 3, 2, 3],
        rule: [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 1, 0],
            [0, 1, 1, 1]
        ],
        tip: ""
    },
    9: {
        initColor: [0, 0, 1, 2],
        rule: [
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 1, 1]
        ],
        tip: "胜利近在咫尺"
    },
    10: {
        initColor: [2, 3, 1, 2],
        rule: [
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 1, 1, 1]
        ],
        tip: "最后一关！"
    },
}

// for debug
if (game.debugMode){
    let debugLevel = Math.max(...Object.keys(game.data).map(a=>Number(a)));
    game.gameID = debugLevel;
    game.start_game();
}

function clearProcess(){
    localStorage.removeItem("game_process");
    window.location.reload();
}

game.get_item("#startGame").addEventListener("click", game.start_game);
game.get_item("#load").addEventListener("click", game.load_process);
game.get_item("#next").addEventListener("click", game.checkNext);