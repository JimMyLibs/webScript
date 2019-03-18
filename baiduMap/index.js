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


if(location.hostname.includes('map.baidu.com')){  
    window.onload = ()=>{ 
        setTimeout(()=>{  
            var allTypes = ['all','passed','hasNotLook','willLook','looked','oneStar','twoStar','threeStar','willSelect'];
            // 小区分类目录
            var allTypeObj = {
                all: [],
                passed: [],
                hasNotLook: [],
                willLook: [],
                looked: ["银座金钻", "国际名园", "庐山花园","凯旋TRC", "汇泰大厦", "怡都大厦", "大中华汇展阁", "港岛银座", "星桂园-C座", "名仕阁", "好年华东门金座", "立新花园(人民北路)", "碧海富通城-三期", "碧海富通城-四期", "广兴源圣拿威湾美花园", "祥福雅居", "庐江春天公寓", "荔馨村", "桃苑公寓", "澎柏·白金假日公寓", "大都汇大厦", "龙珠花园", "国际市长交流中心", "友谊大厦", "南洋大厦", "东海大厦", "宏丰大厦"],
                oneStar: [],
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
                .jimMark.passed {
                    background: #9E9E9E;   
                }
                .jimMark.hasNotLook {
                    background: #607D8B;   
                }
                .jimMark.willLook {
                    background: #FF9800;   
                }
                .jimMark.looked {
                    background: #3385ff;   
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
            allTypeObj.all = Array.from(jimMark).map(item=>item.innerText);
            // 打印汇总
            var allMarkedObj = {
                all: { '名称' : "总数", '总数' : '-',  '占比': '-',  '已标记': '-', '未标记': '-' },
                passed: { '名称' : "筛掉", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                hasNotLook: { '名称' : "未看", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                willLook: { '名称' : "计划", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                looked: { '名称' : "已看", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                oneStar: { '名称' : "一星", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                twoStar: { '名称' : "二星", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                threeStar: { '名称' : "三星", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                willSelect: { '名称' : "待选", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
            }
            allTypes.map(item=>{
                allMarkedObj[item]['总数'] = allTypeObj[item].length;
                allMarkedObj[item]['占比'] = (allMarkedObj[item]['总数'] / allMarkedObj['all']['总数']).toFixed(3)*1000/10 + '%';
                allMarkedObj[item]['已标记']  = Array.from(document.getElementsByClassName('jimMark '+item)).length;
                allMarkedObj[item]['未标记']  = allTypeObj[item].filter(cell=>!allTypeObj.all.includes(cell));
            })

            console.table(Object.values(allMarkedObj), ['名称','总数', '占比', '已标记', '未标记']);
            console.log('百度地图收藏夹: 脚本执行完毕');    
        },3000)
    }
}

