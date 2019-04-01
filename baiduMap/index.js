// ==UserScript==
// @name baiduMapMark
// @namespace baiduMapMark Scripts
// @match *://*/*
// @grant none
// ==/UserScript==   

if(location.hostname.includes('map.baidu.com')){  
    window.onload = ()=>{ 
        setTimeout(()=>{  
            const allTypeColors = {
                all: {
                    label: '全部',
                    color: '#607D8B',
                    sum: { '名称' : "总数", '总数' : '-',  '占比': '-',  '已标记': '-', '未标记': '-' },// 所有百度地图的收藏点：手动收藏，自动抓取
                    communitis: [],
                },
                passed: {
                    label: '筛掉',
                    color: '#9E9E9E',
                    sum: { '名称' : "筛掉", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },// 因产权/楼龄问题pass掉的：手动录入
                    communitis: ['大中华汇展阁','丽湾国际公寓','罗湖金岸','汇商名苑','同泰时代广场','南塘物业小区', '龙园山庄', '阳基新天地'],
                },
                hasNotLook: {
                    label: '未看',
                    color: '#607D8B',
                    sum: { '名称' : "未看", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },// 还没看的：手动录入
                    communitis: [],
                },
                willLook: {
                    label: '计划',
                    color: '#FF9800',
                    sum: { '名称' : "计划", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },// 打算看的：手动录入
                    communitis: [ '阳光绿地家园', '佳兆业新都汇', '红树家邻', '安徽大厦创展中心', '彩福大厦'],
                },
                looked:  {
                    label: '已看',
                    color: '#666666',
                    sum: { '名称' : "已看", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },// 已经看过的：手动录入
                    communitis: ['旺业豪苑', '南塘物业小区','城市天地广场', '云景豪园', '双城世纪大厦','阳光新干线家园','长丰苑','笋岗大厦', 
                                '同乐大厦','银座金钻', '国际名园', '庐山花园','凯旋TRC', '汇泰大厦', '怡都大厦', '大中华汇展阁', '港岛银座', '星桂园-C座', 
                                '名仕阁', '好年华东门金座', '立新花园(人民北路)', '碧海富通城-三期', '碧海富通城-四期', '广兴源圣拿威湾美花园', '祥福雅居', 
                                '庐江春天公寓', '荔馨村', '桃苑公寓', '澎柏·白金假日公寓', '大都汇大厦', '龙珠花园', '国际市长交流中心', '友谊大厦', '南洋大厦', 
                                '东海大厦', '宏丰大厦','怡康家园', '东方盛世花园', '信义假日名城-溢芳园', '国展苑', '大地花园', '信和爱琴居'],
                },
                oneStar: {
                    label: '一星',
                    color: '#8BC34A',
                    sum: { '名称' : "一星", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                    communitis: ['国际名园','港岛银座','广兴源圣拿威湾美花园','名仕阁','好年华东门金座', '国展苑', '祥福雅居'],
                },
                twoStar: {
                    label: '二星',
                    color: '#4CAF50',
                    sum: { '名称' : "二星", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                    communitis: ['城市天地广场', '东方盛世花园', '信义假日名城-溢芳园',],
                },
                threeStar: {
                    label: '三星',
                    color: '#009688',
                    sum: { '名称' : "三星", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                    communitis: [],
                },
                willSelect: {
                    label: '待选',
                    color: '#00e0cb',
                    sum: { '名称' : "待选", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                    communitis: [],   
                },
                primarySchool: {
                    label: '小学',
                    color: '#2196f3',
                    sum: { '名称' : "小学", '总数' : 0,  '占比': 0 , '已标记': 0, '未标记': [] },
                    communitis: [],
                },
            }
            const allTypes = Object.keys(allTypeColors);
            // 小区分类目录
            let allTypeObj = {}
            allTypes.map(item=>{
                allTypeObj[item] = allTypeColors[item].communitis;
            })
            // 打印汇总
            let allMarkedObj = {}
            allTypes.map(item=>{
                allMarkedObj[item] = allTypeColors[item].sum;
            })
            // style: 生成样式
            const styleTag = document.createElement('style');
            {styleTag.innerHTML = `
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
                .jimMark.willLook {
                    background: #FF9800;   
                }
                .jimMark.looked {
                    background: #666666;   
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
                .jimMark.primarySchool {
                    background: #2196f3;   
                }
            `}
            document.head.appendChild(styleTag)
            console.log('百度地图收藏夹: 样式添加成功');  

            // 所有收藏夹
            const mark = document.getElementsByClassName('BMap_Marker')
            // 标注所有收藏夹
            Array.from(mark).map(item=>{
                item.innerHTML = 
                `<div class="jimMark">${item.title}</div>`
            })
            // 标注已看小区
            const jimMark = document.getElementsByClassName('jimMark');
            Array.from(jimMark).map(item=>{
                allTypes.map(type=>{
                    if(item.innerText.includes('小学')||item.innerText.includes('学校')||item.innerText.includes('一小')){
                        item.className = item.className + ' ' + 'primarySchool';
                    }else if(allTypeObj[type].includes(item.innerText)){
                        item.className = item.className + ' ' + type;
                    }
                })
            })
            allTypeObj.all = Array.from(jimMark).map(item=>item.innerText);
            // 打印汇总
            allTypes.map(item=>{
                allMarkedObj[item]['总数'] = allTypeObj[item].length;
                allMarkedObj[item]['占比'] = (allMarkedObj[item]['总数'] / allMarkedObj['all']['总数']).toFixed(3)*1000/10 + '%';
                allMarkedObj[item]['已标记']  = Array.from(document.getElementsByClassName('jimMark '+item)).length;
                allMarkedObj[item]['未标记']  = allTypeObj[item].filter(cell=>!allTypeObj.all.includes(cell));
            })
            // 颜色说明
            console.log('%c↓颜色说明↓',"padding:5px 200px;background-image: -webkit-gradient(linear, left 0, right 0, from(rgb(444, 94, 170)), to(rgb(122, 152, 216)));-webkit-background-clip: text;-webkit-text-fill-color: #fff;font-size:20px;");
            console.groupCollapsed();
                allTypes.map(item=>{
                    const title = '%c' + allTypeColors[item].label;
                    const style = 'color: #fff; background:' + allTypeColors[item].color;
                    console.log(title,style);
                })
            console.groupEnd();
            console.table(Object.values(allMarkedObj), ['名称','总数', '占比', '已标记', '未标记']);
            console.log('百度地图收藏夹: 脚本执行完毕');    
        },2000)
    }
}

