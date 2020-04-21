import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
class MyTab extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { tab, onClick } = this.props;
        return (
            <View className="tab">
                <View
                    className={"tabItem" + " " + (tab ? "active" : "")}
                    onClick={onClick.bind(this, "goods")}
                >
                    按宝贝选择
                </View>
                <View
                    className={"tabItem right" + " " + (tab ? "" : "active")}
                    onClick={onClick.bind(this, "classify")}
                >
                    按分类选择
                </View>
            </View>
        );
    }
}
export default MyTab;
