// ==UserScript==
// @name baiduMapMark
// @namespace baiduMapMark Scripts
// @include https://map.baidu.com/*
// @grant none
// ==/UserScript==   

if (location.hostname.includes('map.baidu.com')) {
    window.onload = () => {
        setTimeout(() => {
            const allData = {
                jimMark: {
                    label: '全部',
                    color: '#607D8B',
                    table: { '名称': "总数", '总数': '-', '占比': '-', '已标记': '-', '未标记': '-' },// 所有百度地图的收藏点：手动收藏，自动抓取
                    list: [],
                },
                hasNotLook: {
                    label: '未看',
                    color: '#607D8B',
                    table: { '名称': "未看", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },// 还没看的：手动录入
                    list: [],
                },
                willLook: {
                    label: '计划',
                    color: '#FF9800',
                    table: { '名称': "计划", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },// 打算看的：手动录入
                    list: ['阳光绿地家园', '佳兆业新都汇', '东方都会', '龙景花园', '龙园山庄'],
                },
                passed: {
                    label: '筛掉',
                    color: '#9E9E9E',
                    table: { '名称': "筛掉", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },// 因产权/楼龄问题pass掉的：手动录入
                    list: ['大中华汇展阁', '丽湾国际公寓', '罗湖金岸', '汇商名苑', '同泰时代广场', '南塘物业小区', '阳基新天地',
                        '旺业豪苑', '云景豪园', '双城世纪大厦', '阳光新干线家园', '长丰苑', '笋岗大厦', '韵动家园', '雅乐居',
                        '同乐大厦', '银座金钻', '庐山花园', '凯旋TRC', '汇泰大厦', '怡都大厦', '港岛银座', '星桂园-C座', '兴达华府',
                        '立新花园(人民北路)', '碧海富通城-三期', '碧海富通城-四期', '红树家邻', '祥云天都世纪-A栋', '曦龙山庄',
                        '庐江春天公寓', '荔馨村', '桃苑公寓', '澎柏·白金假日公寓', '大都汇大厦', '龙珠花园', '国际市长交流中心', '友谊大厦', '南洋大厦',
                        '东海大厦', '宏丰大厦', '怡康家园', '大地花园', '信和爱琴居', '深圳桐林公寓',
                    ],
                },
                oneStar: {
                    label: '一星',
                    color: '#007399',
                    table: { '名称': "一星", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },
                    list: ['国际名园', '广兴源圣拿威湾美花园', '名仕阁', '好年华东门金座', '国展苑', '祥福雅居', '东方凤雅台'],
                },
                twoStar: {
                    label: '二星',
                    color: '#0099cc',
                    table: { '名称': "二星", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },
                    list: ['城市天地广场', '东方盛世花园', '信义假日名城-溢芳园',],
                },
                threeStar: {
                    label: '三星',
                    color: '#00bfff',
                    table: { '名称': "三星", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },
                    list: [],
                },
                willSelect: {
                    label: '待选',
                    color: '#00ffff',
                    table: { '名称': "待选", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },
                    list: [],
                },
                kindergarten: {
                    label: '幼儿园',
                    color: '#00ff7f',
                    table: { '名称': "幼儿园", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },
                    list: [],
                },
                primarySchool: {
                    label: '小学',
                    color: '#9acd32',
                    table: { '名称': "小学", '总数': 0, '占比': 0, '已标记': 0, '未标记': [] },
                    list: [],
                },
            }
            const allTypes = Object.keys(allData); // 所有分类            
            let type_list = {} // 小区分类目录
            let type_table = {} // 打印汇总
            const styleTag = document.createElement('style'); // style: 生成样式           
            styleTag.innerHTML = `.jimMark {
                                    display: none;  
                                    width: 50px;
                                    background: #607D8B;
                                    color: #fff;
                                    padding: 2px;
                                    font-family: microsoft yahei;
                                    line-height: 1.2;
                                }
                                .jimMark.active{
                                    display: block;                                    
                                }
                                .switchDiv{
                                    position: absolute;
                                    top: 70px;
                                    right: 10px;
                                    background: #0000006b;
                                    color: #fff;
                                    text-align: center;
                                }
                                .switchDiv>div{
                                    padding: 1px 1px;
                                    cursor: pointer;
                                    display: block;
                                }
                                .switchDiv>div.active{
                                    background: #3385ff;
                                }`
            const switchDiv = document.createElement('div'); // 显隐开关
            switchDiv.className = 'switchDiv';
            window.switchType = function (type) {
                const typeDiv = document.getElementsByClassName(type) // 所有开关
                Array.from(typeDiv).map(item => {
                    if (item.className.indexOf('active') > -1) {
                        item.className = item.className.replace(/active/g, '');
                    } else {
                        item.className += ' active';
                    }
                })
            }
            allTypes.map(item => {
                type_list[item] = allData[item].list;
                type_table[item] = allData[item].table;
                styleTag.innerHTML += ` .jimMark.${item} {background: ${allData[item].color};}`
                switchDiv.innerHTML += `<div class="jimMark ${item} active" onclick="switchType('${item}')">${allData[item].label}</div>`
            })
            document.head.appendChild(styleTag)
            document.body.appendChild(switchDiv)
            console.log('百度地图收藏夹: 样式添加成功');

            const mark = document.getElementsByClassName('BMap_Marker') // 所有收藏夹            
            Array.from(mark).map(item => { // 标注所有收藏夹
                item.innerHTML = `<div class="jimMark active">${item.title}</div>`
            })
            // 标注已看小区
            const jimMarkDiv = document.getElementsByClassName('jimMark');
            const isPrimarySchool = (item) => { return item.innerText.includes('小学') || item.innerText.includes('学校') || item.innerText.includes('一小'); }
            const isKindergarten = (item) => { return item.innerText.includes('幼儿园'); }
            const type_list_allMarked = Array.from(jimMarkDiv).map(item => item.innerText)
            const type_list_allInput = Object.values(type_list).reduce((sum, item) => { sum = sum.concat(item); return sum }, [])
            type_list['jimMark'] = type_list_allMarked;
            type_list['hasNotLook'] = type_list_allMarked.filter(item => type_list_allInput.indexOf(item) == -1)
            type_list['kindergarten'] = Array.from(jimMarkDiv).filter(item => isKindergarten(item))
            type_list['primarySchool'] = Array.from(jimMarkDiv).filter(item => isPrimarySchool(item))
            Array.from(jimMarkDiv).map(item => {
                allTypes.map(type => {
                    if (isPrimarySchool(item)) {
                        item.className = item.className + ' ' + 'primarySchool';
                    } else if (isKindergarten(item)) {
                        item.className = item.className + ' ' + 'kindergarten';
                    } else if (type_list[type].includes(item.innerText)) {
                        item.className = item.className + ' ' + type;
                    }
                })
            })
            // 打印汇总
            allTypes.map(item => {
                type_table[item]['总数'] = type_list[item].length;
                type_table[item]['占比'] = (type_table[item]['总数'] / type_table['jimMark']['总数']).toFixed(3) * 1000 / 10 + '%';
                type_table[item]['已标记'] = Array.from(document.getElementsByClassName('jimMark ' + item)).length;
                type_table[item]['未标记'] = type_list[item].filter(cell => !type_list.jimMark.includes(cell));
            })
            // 颜色说明
            console.log('%c↓颜色说明↓', "padding:5px 200px;background-image: -webkit-gradient(linear, left 0, right 0, from(rgb(444, 94, 170)), to(rgb(122, 152, 216)));-webkit-background-clip: text;-webkit-text-fill-color: #fff;font-size:20px;");
            console.groupCollapsed();
            allTypes.map(item => {
                const title = '%c' + allData[item].label;
                const style = 'color: #fff; background:' + allData[item].color;
                console.log(title, style);
            })
            console.groupEnd();
            console.table(Object.values(type_table), ['名称', '总数', '占比', '已标记', '未标记']);
            console.log('百度地图收藏夹: 脚本执行完毕');
        }, 5000)
    }
}
