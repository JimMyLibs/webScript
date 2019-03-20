// ==UserScript==
// @name baiduMapMark
// @namespace baiduMapMark Scripts
// @match *://*/*
// @grant none
// ==/UserScript==   

// 筛掉   passed: background: #9E9E9E;
// 未看   hasNotLook: background: #607D8B;
// 计划   willLook: background: #FF9800;
// 已看   looked:  background: #3385ff;
// 一星   oneStar: background: #8BC34A;
// 二星   twoStar: background: #4CAF50;
// 三星   threeStar: background: #009688;
// 待选   willSelect: background: #00e0cb;



window.onload = ()=>{ 
    setTimeout(()=>{  
        var allTypes = ['passed','hasNotLook','willLook','looked','oneStar','twoStar','threeStar','willSelect'];
        // 小区分类目录
        var allTypeObj = {
            passed: ["大中华汇展阁","丽湾国际公寓","罗湖金岸","汇商名苑","同泰时代中心",],
            hasNotLook: [],
            willLook: ['笋岗大厦', '同乐大厦', '朗钜御风庭', '东门金座', '丰湖花园'],
            looked: ["银座金钻", "国际名园", "庐山花园","凯旋TRC", "汇泰大厦", "怡都大厦", "大中华汇展阁", "港岛银座", "星桂园-C座", "名仕阁", "好年华东门金座", "立新花园(人民北路)", "碧海富通城-三期", "碧海富通城-四期", "广兴源圣拿威湾美花园", "祥福雅居", "庐江春天公寓", "荔馨村南山区", "桃苑公寓", "澎柏·白金假日公寓", "大都汇大厦", "龙珠花园", "国际市长交流中心", "友谊大厦", "南洋大厦", "东海大厦", "宏丰大厦罗湖"],
            oneStar: ['汇泰大厦','国际名园','港岛银座','广兴源圣拿威湾美花园'],
            twoStar: [],
            threeStar: [],
            willSelect: [],            
        }
        // style: 生成样式
        var styleTag = document.createElement('style');
        styleTag.innerHTML = `
            .jimMark {
                width: 50px;
                background: #607D8B;
                color: #fff;
                padding: 2px;
                font-family: microsoft yahei;
                line-height: 1.2;
            }
            .jimMark.hasNotLook {
                background: #607D8B;   
            }
            .jimMark.looked {
                background: #3385ff;   
            }
            .jimMark.willLook {
                background: #FF9800;   
            }
            .jimMark.passed {
                background: #9E9E9E;   
            }
            .jimMark.oneStar {
                background: #8BC34A;   
            }
            .jimMark.twoStar {
                background: #4CAF50;   
            }
            .jimMark.threeStar {
                background: #009688;   
            }
            .jimMark.willSelect {
                background: #00e0cb;   
            }
        `
        document.head.appendChild(styleTag)
        console.log('百度地图收藏夹: 样式添加成功');  

        // 所有收藏夹
        var mark = document.getElementsByClassName('BMap_Marker')
        // 标注所有收藏夹
        Array.from(mark).map(item=>{
            item.innerHTML = 
            `<div class="jimMark">${item.title}</div>`
        })
        // 标注已看小区
        var jimMark = document.getElementsByClassName('jimMark');
        Array.from(jimMark).map(item=>{
            allTypes.map(type=>{
                if(allTypeObj[type].includes(item.innerText)){
                    item.className = item.className + ' ' + type;
                }
            })
        })
        // 打印汇总
        var allMarkedObj = {
            passed: { name : "筛掉", sum : 0, marked: 0 },
            hasNotLook: { name : "未看", sum : 0, marked: 0 },
            willLook: { name : "计划", sum : 0, marked: 0 },
            looked: { name : "已看", sum : 0, marked: 0 },
            oneStar: { name : "一星", sum : 0, marked: 0 },
            twoStar: { name : "二星", sum : 0, marked: 0 },
            threeStar: { name : "三星", sum : 0, marked: 0 },
            willSelect: { name : "待选", sum : 0, marked: 0 },
        }
        allTypes.map(item=>{
            allMarkedObj[item].sum = allTypeObj[item].length;
            allMarkedObj[item].marked = Array.from(document.getElementsByClassName('jimMark '+item)).length;
        })

        console.table(Object.values(allMarkedObj), ["name","sum","marked"]);
        console.log('百度地图收藏夹: 脚本执行完毕');    
    },3000)
}

