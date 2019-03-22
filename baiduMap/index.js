// ==UserScript==
// @name baiduMapMark
// @namespace baiduMapMark Scripts
// @match *://*/*
// @grant none
// ==/UserScript==   

// 筛掉   passed: background: #9E9E9E;
// 未看   hasNotLook: background: #607D8B;
// 计划   willLook: background: #FF9800;
// 已看   looked:  background: #666666;
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
                passed: ["大中华汇展阁","丽湾国际公寓","罗湖金岸","汇商名苑","同泰时代广场"],
                hasNotLook: [],
                willLook: ['双城世纪大厦','阳光新干线家园','长丰苑','笋岗大厦', '同乐大厦', '朗钜·御风庭', '好年华东门金座', '丰湖花园','阳光绿地家园','大地花园','翡翠星光园','东方盛世花园','居欢颜·美杜兰华庭','丽廷豪苑',"宝龙花园", "佳兆业新都汇", "东方都会", "丹枫雅苑", "大世纪水山缘", "云景豪园", "鸿翠苑", "泽润华庭", "鸿景豪苑", "信和爱琴居", "龙园山庄", "茂业城", "德兴城", "又一村花园", "丹枫白露城-东1号", "红树家邻", "安徽大厦创展中心", "彩福大厦"],
                looked: ["银座金钻", "国际名园", "庐山花园","凯旋TRC", "汇泰大厦", "怡都大厦", "大中华汇展阁", "港岛银座", "星桂园-C座", "名仕阁", "好年华东门金座", "立新花园(人民北路)", "碧海富通城-三期", "碧海富通城-四期", "广兴源圣拿威湾美花园", "祥福雅居", "庐江春天公寓", "荔馨村", "桃苑公寓", "澎柏·白金假日公寓", "大都汇大厦", "龙珠花园", "国际市长交流中心", "友谊大厦", "南洋大厦", "东海大厦", "宏丰大厦"],
                oneStar: ['汇泰大厦','国际名园','港岛银座','广兴源圣拿威湾美花园','名仕阁'],
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
                    background: #666666;   
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
            allTypeObj.all = Array.from(jimMark).map(item=>item.innerText);
            // 打印汇总
            var allMarkedObj = {
                all: { '名称' : "总数", '总数' : '-',  '占比': '-',  '已标记': '-', '未标记': '-' },// 所有百度地图的收藏点：手动收藏，自动抓取
                passed: { '名称' : "筛掉", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },// 因产权/楼龄问题pass掉的：手动录入
                hasNotLook: { '名称' : "未看", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },// 还没看的：手动录入
                willLook: { '名称' : "计划", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },// 打算看的：手动录入
                looked: { '名称' : "已看", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },// 已经看过的：手动录入
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
        },2000)
    }
}

