import Taro, { Component } from "@tarojs/taro";
import { View, Checkbox, Text } from "@tarojs/components";
import "./index.scss";
import "./iconfont.css";
class MyTable extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            onCheckedAll,
            checkedAll,
            orderBy,
            onOrderByChange,
            babyList,
            onCheckedChange,
            notFind
        } = this.props;
        return (
            <View className="showTable">
                <View className="tableTitle">
                    <View className="selectAll">
                        <Checkbox
                            className="checkBox"
                            checked={checkedAll}
                            onChange={onCheckedAll}
                        >
                            全选
                        </Checkbox>
                    </View>
                    <View className="goodsInfo">宝贝信息</View>
                    <View className="goodsPrice">价格</View>
                    <View className="goodsInventory">
                        <Text>库存</Text>
                        <Text
                            class={
                                "iconfont icon-icon-test asc " +
                                " " +
                                (orderBy === "num:asc" && "orderBy")
                            }
                            onClick={onOrderByChange.bind(this, "num:asc")}
                        ></Text>
                        <Text
                            class={
                                "iconfont icon-icon-test1 desc" +
                                " " +
                                (orderBy === "num:desc" && "orderBy")
                            }
                            onClick={onOrderByChange.bind(this, "num:desc")}
                        ></Text>
                    </View>
                    <View className="goodsSale">
                        <Text>销量</Text>
                        <Text
                            class={
                                "iconfont icon-icon-test asc" +
                                " " +
                                (orderBy === "sold_quantity:asc" && "orderBy")
                            }
                            onClick={onOrderByChange.bind(
                                this,
                                "sold_quantity:asc"
                            )}
                        ></Text>
                        <Text
                            class={
                                "iconfont icon-icon-test1 desc" +
                                " " +
                                (orderBy === "sold_quantity:desc" && "orderBy")
                            }
                            onClick={onOrderByChange.bind(
                                this,
                                "sold_quantity:desc"
                            )}
                        ></Text>
                    </View>
                </View>
                <View className="tableContent">
                    {babyList.map(item => {
                        return (
                            <View className="tableRow" key={item.num_iid}>
                                <View className="selectAll">
                                    <Checkbox
                                        checked={item.checked}
                                        onChange={onCheckedChange.bind(
                                            this,
                                            item.num_iid
                                        )}
                                    ></Checkbox>
                                </View>
                                <View className="goodsInfo">
                                    <View className="goodsImg">
                                        <image
                                            src={item.pic_url}
                                            className="goodsImg"
                                        />
                                    </View>
                                    <View className="goodsTitle">
                                        {item.title}
                                    </View>
                                </View>
                                <View className="goodsPrice">
                                    ¥{item.price}
                                </View>
                                <View className="goodsInventory">
                                    {item.num}
                                </View>
                                <View className="goodsSale">
                                    {item.sold_quantity}
                                </View>
                            </View>
                        );
                    })}
                    {/* 当搜索不到时展示的页面信息 */}
                    {notFind && (
                        <View className="notFind ">
                            <View>标题</View>
                            <Text>未找到符合条件的宝贝</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    }
}
export default MyTable;
