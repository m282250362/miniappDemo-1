import Taro, { Component } from "@tarojs/taro";
import { View, Checkbox, Button, Input, Text } from "@tarojs/components";
import MyTab from "../../components/babyTab";
import MyPagination from "pcComponents/myPagination";
import MySelect from "pcComponents/mySelect";
import MyTable from "../../components/BabyTable";
import "./index.scss";

import { taobaoItemListGet } from "../../public/tradePublic/itemTopApi/taobaoItemListGet";
class ChooseGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultStatus: "出售中",
            defaultClassify: [],
            defaultKeyWords: "宝贝关键词",
            defaultSearch: "",
            babyList: [],
            total: 0,
            pageNum: 1,
            pageSize: 20,
            checkedBabyList: [],
            inputValue: "",
            checkedAll: false,
            defaultTab: true,
            notFind: false,
            orderBy: "list_time:asc",
            encoddingList: [],
            defaultClassify: "全部分类"
        };
    }
    componentDidMount() {
        this.getTaobaoList();
    }
    //调用淘宝api的函数
    getTaobaoList = () => {
        if (this.state.defaultKeyWords === "宝贝关键词") {
            taobaoItemListGet({
                feilds: "num_iid,pic_url,title,price,num,sold_quantity,out_id",
                status: this.state.defaultStatus,
                page_no: this.state.pageNum,
                page_size: this.state.pageSize,
                extraArgs: {
                    q: this.state.inputValue,
                    order_by: this.state.orderBy
                },
                callback: this.getBabyList
            });
        } else {
            if (this.state.encoddingList.length === 0) {
                taobaoItemListGet({
                    feilds:
                        "num_iid,pic_url,title,price,num,sold_quantity,out_id",
                    status: this.state.defaultStatus,
                    page_no: this.state.pageNum,
                    page_size: this.state.pageSize,
                    extraArgs: {
                        order_by: this.state.orderBy
                    },
                    callback: this.getEncoddingList
                });
            } else {
                let { encoddingList } = this.state;
                this.filterBabyList(encoddingList);
            }
        }
    };
    //获取宝贝数据
    getBabyList = data => {
        if (data.total_results === 0) {
            this.setState({
                babyList: [],
                notFind: true,
                checkedAll: false
            });
            return;
        }
        console.log(7777777777777777);
        console.log(data);
        let counter = 0;
        let arr = data.items.item.map(v => {
            v.pic_url += "_60x60";
            v.checked = false;
            return v;
        });
        this.state.checkedBabyList.forEach(val => {
            arr = arr.map(v => {
                if (v.num_iid === val) {
                    v.checked = true;
                    counter++;
                }
                return v;
            });
        });

        if (counter === arr.length) {
            console.log(10101010);

            this.setState({
                babyList: [...arr],
                total: data.total_results,
                checkedAll: true,
                notFind: false
            });
        } else {
            this.setState({
                babyList: [...arr],
                total: data.total_results,
                notFind: false,
                checkedAll: false
            });
        }
    };
    // 按商家编码搜索
    getEncoddingList = data => {
        if (data.total_results === 0) {
            this.setState({
                enciddingList: [],
                babyList: [],
                notFind: true,
                checkedAll: false
            });
            return;
        }
        let num = Math.ceil((data.total_results * 1.0) / this.state.pageSize);
        let arr = [];
        this.getList(1, num, arr);
    };
    //递归遍历所有商品
    getList = (i, total, list) => {
        if (i > total) {
            list = list.map(v => {
                v.pic_url += "_60x60";
                v.checked = false;
                return v;
            });
            this.setState(
                {
                    encoddingList: [...list]
                },
                () => {
                    let { encoddingList } = this.state;
                    this.filterBabyList(encoddingList);
                }
            );
            return;
        } else {
            taobaoItemListGet({
                feilds: "num_iid,pic_url,title,price,num,sold_quantity,out_id",
                status: this.state.defaultStatus,
                page_no: i,
                page_size: this.state.pageSize,
                extraArgs: {
                    order_by: this.state.orderBy
                },
                callback: data => {
                    list = [...list, ...data.items.item];
                    return this.getList(++i, total, list);
                }
            });
        }
    };
    //筛选符合条件的宝贝列表    //当第一次请求商家编码数据后，以后对商家编码的查找全部从已存储数据中筛选不再请求服务器
    filterBabyList = list => {
        const { orderBy } = this.state;
        if (orderBy === "num:asc") {
            list = list.sort((a, b) => {
                return a.num - b.num;
            });
        } else if (orderBy === "num:desc") {
            list = list.sort((a, b) => {
                return b.num - a.num;
            });
        } else if (orderBy === "sold_quantity:asc") {
            list = list.sort((a, b) => {
                return a.num - b.num;
            });
        } else if (orderBy === "sold_quantity:desc") {
            list = list.sort((a, b) => {
                return b.num - a.num;
            });
        }

        if (this.state.inputValue.trim() !== "") {
            list = list.filter(v => {
                return v.outer_id === this.state.inputValue;
            });
        }
        let babyList = [];
        for (
            let i = (this.state.pageNum - 1) * this.state.pageSize;
            i < this.state.pageNum * this.state.pageSize;
            i++
        ) {
            if (list[i]) {
                babyList.push(list[i]);
            } else {
                break;
            }
        }
        let counter = 0;
        this.state.checkedBabyList.forEach(val => {
            babyList = babyList.map(v => {
                if (v.num_iid === val) {
                    v.checked = true;
                    counter++;
                }
                return v;
            });
        });
        if (babyList.length === 0) {
            this.setState({
                babyList: [...babyList],
                total: babyList.length,
                checkedAll: false,
                notFind: true
            });
        } else {
            if (counter === babyList.length) {
                this.setState({
                    babyList: [...babyList],
                    total: list.length,
                    checkedAll: true,
                    notFind: false
                });
            } else {
                this.setState({
                    babyList: [...babyList],
                    total: list.length,
                    notFind: false,
                    checkedAll: false
                });
            }
        }
    };

    //当页码和数量发生变化时
    onPageChange = (type, v) => {
        if (type === "pageNo") {
            this.setState(
                {
                    pageNum: v
                },
                () => {
                    this.getTaobaoList();
                }
            );
        } else {
            this.setState(
                {
                    pageSize: v
                },
                () => {
                    this.getTaobaoList();
                }
            );
        }
    };
    //当checkBox发生变化时

    onCheckedChange = (id, e) => {
        let { checkedBabyList, babyList, checkedAll } = this.state;
        if (e.target.value) {
            if (
                !checkedBabyList.some(v => {
                    return v.num_iid === id;
                })
            ) {
                checkedBabyList.push(id);
            }
        } else {
            checkedBabyList = checkedBabyList.filter(v => {
                return v !== id;
            });
        }
        let babyArr = babyList.map(v => {
            if (this.state.checkedBabyList.length < 500) {
                if (v.num_iid === id) {
                    v.checked = !v.checked;
                }
            }
            return v;
        });
        let counter = 0;
        babyArr.forEach(v => {
            if (v.checked) {
                counter++;
            }
        });
        if (babyArr.length === counter) {
            checkedAll = true;
        } else {
            checkedAll = false;
        }
        this.setState({
            babyList: [...babyArr],
            checkedBabyList: [...checkedBabyList],
            checkedAll: checkedAll
        });
    };
    //当全选按钮发生变化时
    onCheckedAll = () => {
        let { babyList, pageSize, checkedAll, checkedBabyList } = this.state;
        if (this.state.checkedBabyList.length >= 500) {
            return;
        }
        if (this.state.checkedBabyList.length + pageSize > 500) {
            return;
        }
        let arr = [];
        if (checkedAll) {
            arr = babyList.map(v => {
                v.checked = false;
                checkedBabyList = checkedBabyList.filter(val => {
                    return val !== v.num_iid;
                });
                return v;
            });
        } else {
            arr = babyList.map(v => {
                v.checked = true;
                if (
                    !checkedBabyList.some(val => {
                        return val === v.num_iid;
                    })
                ) {
                    checkedBabyList.push(v.num_iid);
                }
                return v;
            });
        }
        this.setState({
            babyList: [...arr],
            checkedAll: !checkedAll,
            checkedBabyList: [...checkedBabyList]
        });
    };
    //当切换tab时
    toggleTab = type => {
        if (type === "goods") {
            this.setState({
                defaultTab: true
            });
        } else {
            this.setState({
                defaultTab: false
            });
        }
    };
    //当第一个下拉选择框变化时
    onDefaultChange = (k, e) => {
        if (k === "status") {
            this.setState({
                defaultStatus: e,
                encoddingList: []
            });
        } else if (k === "keyWord") {
            this.setState({
                defaultKeyWords: e
            });
        } else if (k === "classify") {
            this.setState({
                defaultClassify: e
            });
        }
    };
    //当搜索框发生变化时
    onInputChange = e => {
        this.setState({
            inputValue: e.target.value.trim()
        });
    };
    //点击搜索确定按钮
    onSearchConfirm = () => {
        this.setState(
            {
                checkedBabyList: [],
                pageNum: 1,
                orderBy: "list_time:asc"
            },
            () => {
                this.getTaobaoList();
            }
        );
    };
    //点击排序
    onOrderByChange = name => {
        this.setState(
            {
                orderBy: name
            },
            () => {
                this.getTaobaoList();
            }
        );
    };

    render() {
        const PAGE_SIZE_LIST = [20, 40, 80, 100];
        return (
            <View className="chooseGoods">
                {/* 标题 */}
                <View className="title">选择宝贝</View>
                {/* tab选项卡 */}
                <MyTab tab={this.state.defaultTab} onClick={this.toggleTab} />
                {/* 选择框及展示表格 */}
                <View
                    className={
                        "tableContainer" +
                        " " +
                        (this.state.defaultTab
                            ? "showContent"
                            : "hiddenContent")
                    }
                >
                    {/* 下拉选择1 */}
                    <View className="select">
                        <View className="dropdown">
                            <MySelect
                                dataSource={["出售中", "仓库中", "已售完"]}
                                onChange={this.onDefaultChange.bind(
                                    this,
                                    "status"
                                )}
                                value={this.state.defaultStatus}
                                controlled
                                className="selectItem"
                            />
                        </View>
                        {/* 下拉选择2 */}
                        <View className="dropdown">
                            <MySelect
                                dataSource={["全部分类"]}
                                onChange={this.onDefaultChange.bind(
                                    this,
                                    "classify"
                                )}
                                value={this.state.defaultClassify}
                                controlled
                                className="selectItem"
                            />
                        </View>
                        {/* 下拉选择3 */}
                        <View className="dropdown">
                            <MySelect
                                dataSource={["宝贝关键词", "商家编码"]}
                                onChange={this.onDefaultChange.bind(
                                    this,
                                    "keyWord"
                                )}
                                value={this.state.defaultKeyWords}
                                controlled
                                className="selectItem keyWord"
                            />
                        </View>
                        {/* 输入框 */}
                        <View className="dropdown">
                            <Input
                                placeholder="请输入搜索内容"
                                className="input"
                                onInput={this.onInputChange}
                            />
                        </View>
                        {/* 确定按钮 */}
                        <View className="dropdown">
                            <Button
                                class="searchBtn"
                                type="normal"
                                onClick={this.onSearchConfirm}
                            >
                                确定
                            </Button>
                        </View>
                    </View>
                    {/* 表格展示 */}
                    <MyTable
                        checkedAll={this.state.checkedAll}
                        onCheckedAll={this.onCheckedAll}
                        orderBy={this.state.orderBy}
                        onOrderByChange={this.onOrderByChange}
                        babyList={this.state.babyList}
                        onCheckedChange={this.onCheckedChange}
                        notFind={this.state.notFind}
                    />
                    {/* 分页 */}
                    <View
                        className={
                            "goodsFooter" +
                            " " +
                            (this.state.notFind ? "hiddenNotFind" : "")
                        }
                    >
                        <View className="pagination">
                            <MyPagination
                                total={this.state.total}
                                pageNo={this.state.pageNum}
                                pageSizeSelector="dropdown"
                                pageSize={this.state.pageSize}
                                pageSizeList={PAGE_SIZE_LIST}
                                onPageSizeChange={this.onPageChange.bind(
                                    this,
                                    "pageSize"
                                )}
                                onPageNoChange={this.onPageChange.bind(
                                    this,
                                    "pageNo"
                                )}
                            />
                        </View>
                    </View>
                    {/* 选择确定按钮 */}
                    <View
                        className={
                            "confirm" +
                            " " +
                            (this.state.notFind ? "hiddenNotFind" : "")
                        }
                    >
                        <Button className="confirmBtn" type="primary">
                            确定（已选{this.state.checkedBabyList.length}/
                            {this.state.total}）
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}

export default ChooseGoods;
