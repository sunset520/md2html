let BlogDirectory = {
    /*
        获取元素位置，距浏览器左边界的距离（left）和距浏览器上边界的距离（top）
    */
    getElementPosition: function (ele) {
        let topPosition = 0;
        let leftPosition = 0;
        while (ele) {
            topPosition += ele.offsetTop;
            leftPosition += ele.offsetLeft;
            ele = ele.offsetParent;
        }
        return { top: topPosition, left: leftPosition };
    },

    /*
    获取滚动条当前位置
    */
    getScrollBarPosition: function () {
        let scrollBarPosition = document.body.scrollTop || document.documentElement.scrollTop;
        return scrollBarPosition;
    },

    /*
    移动滚动条，finalPos 为目的位置，internal 为移动速度
    */
    moveScrollBar: function (finalpos, interval) {

        //若不支持此方法，则退出
        if (!window.scrollTo) {
            return false;
        }

        //窗体滚动时，禁用鼠标滚轮
        window.onmousewheel = function () {
            return false;
        };

        //清除计时
        if (document.body.movement) {
            clearTimeout(document.body.movement);
        }

        let currentpos = BlogDirectory.getScrollBarPosition();//获取滚动条当前位置

        let dist = 0;
        if (currentpos == finalpos) {//到达预定位置，则解禁鼠标滚轮，并退出
            window.onmousewheel = function () {
                return true;
            };
            return true;
        }
        if (currentpos < finalpos) {//未到达，则计算下一步所要移动的距离
            dist = Math.ceil((finalpos - currentpos) / 10);
            currentpos += dist;
        }
        if (currentpos > finalpos) {
            dist = Math.ceil((currentpos - finalpos) / 10);
            currentpos -= dist;
        }

        let scrTop = BlogDirectory.getScrollBarPosition();//获取滚动条当前位置
        window.scrollTo(0, currentpos);//移动窗口
        if (BlogDirectory.getScrollBarPosition() == scrTop)//若已到底部，则解禁鼠标滚轮，并退出
        {
            window.onmousewheel = function () {
                return true;
            };
            return true;
        }

        //进行下一步移动
        let repeat = "BlogDirectory.moveScrollBar(" + finalpos + "," + interval + ")";
        document.body.movement = setTimeout(repeat, interval);
    },

    /*
    创建博客目录，
    id表示包含博文正文的 div 容器的 id，
    mt 和 st 分别表示主标题和次级标题的标签名称（如 H2、H3，大写或小写都可以！），
    interval 表示移动的速度
    */
    createBlogDirectory: function (id, mt, st, interval) {
        //获取博文正文div容器
        let elem = document.getElementById(id);
        if (!elem) return false;
        //获取div中所有元素结点
        let nodes = elem.getElementsByTagName("*");
        //创建博客目录的div容器
        let divSideBar = document.createElement('DIV');
        divSideBar.className = 'sideBar';
        divSideBar.setAttribute('id', 'sideBar');
        let divSideBarTab = document.createElement('DIV');
        divSideBarTab.setAttribute('id', 'sideBarTab');
        divSideBar.appendChild(divSideBarTab);
        let h3 = document.createElement('H3');
        divSideBarTab.appendChild(h3);
        let txt = document.createTextNode('目录');
        h3.appendChild(txt);
        let divSideBarContents = document.createElement('DIV');
        divSideBarContents.style.display = 'none';
        divSideBarContents.setAttribute('id', 'sideBarContents');
        divSideBar.appendChild(divSideBarContents);
        //创建自定义列表
        let dlist = document.createElement("dl");
        divSideBarContents.appendChild(dlist);
        let num = 0;//统计找到的mt和st
        mt = mt.toUpperCase();//转化成大写
        st = st.toUpperCase();//转化成大写
        //遍历所有元素结点
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName == mt || nodes[i].nodeName == st) {
                nodes[i].setAttribute("id", "blogTitle" + num);
                let item;
                switch (nodes[i].nodeName) {
                    case mt:    //若为主标题
                        item = document.createElement("dt");
                        break;
                    case st:    //若为子标题
                        item = document.createElement("dd");
                        break;
                }
                let tempNode = document.createElement("div");
                tempNode.setAttribute("id", nodes[i].id);
                tempNode.innerHTML = nodes[i].innerHTML;
                item.appendChild(tempNode);
                item.setAttribute("name", num);
                item.onclick = function () {        //添加鼠标点击触发函数
                    let pos = BlogDirectory.getElementPosition(document.getElementById("blogTitle" + this.getAttribute("name")));
                    if (!BlogDirectory.moveScrollBar(pos.top, interval)) return false;
                };
                //将自定义表项加入自定义列表中
                dlist.appendChild(item);
                num++;
            }
        }

        // if (num == 0) return false;

        divSideBarTab.onclick = function () {
            if (divSideBarContents.style.display === 'block') {
                divSideBarContents.style.display = 'none';
            }
            else {
                divSideBarContents.style.display = 'block';
            }
        };

        // /*鼠标进入时的事件处理*/
        // divSideBarTab.onmouseenter = function () {
        //     divSideBarContents.style.display = 'block';
        // };
        // /*鼠标离开时的事件处理*/
        // divSideBar.onmouseleave = function () {
        //     divSideBarContents.style.display = 'none';
        // };

        document.body.appendChild(divSideBar);
    }

};

$(document).ready(function () {
    /*页面加载完成之后生成博客目录*/
    BlogDirectory.createBlogDirectory("main", "h2", "h3", 20);
});