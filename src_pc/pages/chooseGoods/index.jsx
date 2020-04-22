import Taro, { Component } from "@tarojs/taro";
import { View, Button, Input } from "@tarojs/components";
import MyTab from "pcComponents/babyTab";
import MyPagination from "pcComponents/myPagination";
import MySelect from "pcComponents/mySelect";
import MyTable from "pcComponents/babyTable";
import "./index.scss";
import { taobaoItemListGet } from "tradePublic/itemTopApi/taobaoItemListGet";
import {
    getArrayByKey,
    resolveTopResponse
} from "tradePublic/tradeDataCenter/common/resolveTopResponse";
class ChooseGoods extends Component {
    constructor(props) {
        super(props);
        this.encoddingList = [];
        this.checkedBabyList = [];
        this.pageNum = 1;
        this.pageSize = 20;
        this.orderBy = "list_time:asc";
        this.state = {
            defaultStatus: "出售中",
            defaultClassify: "全部分类",
            defaultKeyWords: "宝贝关键词",
            defaultSearch: "",
            babyList: [],
            total: 0,
            inputValue: "",
            checkedAll: false,
            defaultTab: true,
            notFind: false
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
                page_no: this.pageNum,
                page_size: this.pageSize,
                extraArgs: {
                    q: this.state.inputValue,
                    order_by: this.orderBy
                },
                callback: this.getBabyList
            });
        } else {
            if (this.encoddingList.length === 0) {
                taobaoItemListGet({
                    feilds:
                        "num_iid,pic_url,title,price,num,sold_quantity,out_id",
                    status: this.state.defaultStatus,
                    page_no: this.pageNum,
                    page_size: this.pageSize,
                    extraArgs: {
                        order_by: this.orderBy
                    },
                    callback: this.getEncoddingList
                });
            } else {
                this.filterBabyList(this.encoddingList);
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
        babyList = resolveTopResponse(data);

        babyList = getArrayByKey("item", babyList);
        console.log(babyList);

        let counter = 0;
        let babyList = babyList.map(item => {
            item.pic_url += "_60x60";
            item.checked = false;
            return item;
        });
        babyList = babyList.map(item => {
            if (this.checkedBabyList.indexOf(item.num_iid) > 0) {
                item.checked = true;
                counter++;
            }
            return item;
        });

        if (counter === babyList.length) {
            console.log(10101010);

            this.setState({
                babyList: [...babyList],
                total: data.total_results,
                checkedAll: true,
                notFind: false
            });
        } else {
            this.setState({
                babyList: [...babyList],
                total: data.total_results,
                notFind: false,
                checkedAll: false
            });
        }
    };
    // 按商家编码搜索
    getEncoddingList = data => {
        if (data.total_results === 0) {
            this.encoddingList = [];
            this.setState({
                babyList: [],
                notFind: true,
                checkedAll: false
            });
            return;
        }
        let num = Math.ceil((data.total_results * 1.0) / this.pageSize);
        console.log(999999);
        console.log(num);

        let babyListArr = [];
        this.getList(1, num, babyListArr);
    };
    //递归遍历所有商品
    getList = (i, total, list) => {
        if (i > total) {
            list = list.map(item => {
                item.pic_url += "_60x60";
                item.checked = false;
                return item;
            });
            this.encoddingList = [...list];
            this.filterBabyList(this.encoddingList);

            return;
        } else {
            taobaoItemListGet({
                feilds: "num_iid,pic_url,title,price,num,sold_quantity,out_id",
                status: this.state.defaultStatus,
                page_no: i,
                page_size: this.pageSize,
                extraArgs: {
                    order_by: this.orderBy
                },
                callback: data => {
                    let babyList = resolveTopResponse(data);

                    babyList = getArrayByKey("item", babyList);
                    list = [...list, ...babyList];
                    return this.getList(++i, total, list);
                }
            });
        }
    };
    //筛选符合条件的宝贝列表    //当第一次请求商家编码数据后，以后对商家编码的查找全部从已存储数据中筛选不再请求服务器
    filterBabyList = list => {
        if (this.orderBy === "num:asc") {
            list = list.sort((a, b) => {
                return a.num - b.num;
            });
        } else if (this.orderBy === "num:desc") {
            list = list.sort((a, b) => {
                return b.num - a.num;
            });
        } else if (this.orderBy === "sold_quantity:asc") {
            list = list.sort((a, b) => {
                return a.num - b.num;
            });
        } else if (this.orderBy === "sold_quantity:desc") {
            list = list.sort((a, b) => {
                return b.num - a.num;
            });
        }

        if (this.state.inputValue.trim() !== "") {
            list = list.filter(item => {
                return item.outer_id === this.state.inputValue;
            });
        }
        let babyList = [];
        const index = (this.pageNum - 1) * this.pageSize;
        const total = this.pageNum * this.pageSize;
        for (let i = index; i < total; i++) {
            if (list[i]) {
                babyList.push(list[i]);
            } else {
                break;
            }
        }
        let counter = 0;

        babyList = babyList.map(item => {
            if (this.checkedBabyList.indexOf(item.num_iid) > 0) {
                item.checked = true;
                counter++;
            } else {
                item.checked = false;
            }
            return item;
        });
        console.log(babyList);

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
    onPageNumChange = num => {
        this.pageNum = num;

        this.getTaobaoList();
    };
    onPageSizeChange = size => {
        this.pageSize = size;
        this.getTaobaoList();
    };
    //当checkBox发生变化时

    onCheckedChange = (id, e) => {
        let { babyList, checkedAll } = this.state;
        if (e.target.value) {
            if (
                !this.checkedBabyList.some(itemId => {
                    return itemId === id;
                })
            ) {
                this.checkedBabyList.push(id);
            }
        } else {
            this.checkedBabyList = this.checkedBabyList.filter(itemId => {
                return itemId !== id;
            });
        }
        let babyArr = babyList.map(item => {
            if (this.checkedBabyList.length < 500) {
                if (item.num_iid === id) {
                    item.checked = !item.checked;
                }
            }
            return item;
        });
        let counter = 0;
        babyArr.forEach(item => {
            if (item.checked) {
                counter++;
            }
        });
        checkedAll = babyArr.length === counter;
        this.setState({
            babyList: [...babyArr],
            checkedAll: checkedAll
        });
    };
    //当全选按钮发生变化时
    onCheckedAll = () => {
        let { babyList, checkedAll } = this.state;
        if (this.checkedBabyList.length >= 500) {
            return;
        }
        if (this.checkedBabyList.length + this.pageSize > 500) {
            return;
        }
        let babyListArr = [];
        if (checkedAll) {
            babyListArr = babyList.map(item => {
                item.checked = false;
                this.checkedBabyList = this.checkedBabyList.filter(val => {
                    return val !== item.num_iid;
                });
                return item;
            });
        } else {
            babyListArr = babyList.map(item => {
                item.checked = true;
                if (
                    !this.checkedBabyList.some(val => {
                        return val === item.num_iid;
                    })
                ) {
                    this.checkedBabyList.push(item.num_iid);
                }
                return item;
            });
        }
        this.setState({
            babyList: [...babyListArr],
            checkedAll: !checkedAll
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
    onDefaultChange = (selectItem, selectName) => {
        if (selectItem === "status") {
            this.encoddingList = [];
            this.setState({
                defaultStatus: selectName
            });
        } else if (selectItem === "keyWord") {
            this.setState({
                defaultKeyWords: selectName
            });
        } else if (selectItem === "classify") {
            this.setState({
                defaultClassify: selectName
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
        this.pageNum = 1;
        this.checkedBabyList = [];
        this.orderBy = "list_time:asc";

        this.getTaobaoList();
    };
    //点击排序
    onOrderByChange = name => {
        this.orderBy = name;
        this.getTaobaoList();
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
                {this.state.defaultTab && (
                    <View className="tableContainer">
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
                            orderBy={this.orderBy}
                            onOrderByChange={this.onOrderByChange}
                            babyList={this.state.babyList}
                            onCheckedChange={this.onCheckedChange}
                            notFind={this.state.notFind}
                        />
                        {!this.state.notFind && (
                            <View>
                                {/* 分页 */}
                                <View className="goodsFooter">
                                    <View className="pagination">
                                        <MyPagination
                                            total={this.state.total}
                                            pageNo={this.pageNum}
                                            pageSizeSelector="dropdown"
                                            pageSize={this.pageSize}
                                            pageSizeList={PAGE_SIZE_LIST}
                                            onPageSizeChange={
                                                this.onPageSizeChange
                                            }
                                            onPageNoChange={
                                                this.onPageNumChange
                                            }
                                        />
                                    </View>
                                </View>
                                {/* // 选择确定按钮 */}
                                <View className="confirm">
                                    <Button
                                        className="confirmBtn"
                                        type="primary"
                                    >
                                        确定（已选{this.checkedBabyList.length}/
                                        {this.state.total}）
                                    </Button>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    }
}

export default ChooseGoods;
