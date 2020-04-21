export const routes = [
    {
        name: "订单管理",
        path: "/tradeManagement",
        abstract: true,
        children: [
            {
                name: "退款管理",
                default: true,
                component: "refundManagement",
                path: "/refundManagement",
                icon: "iconfont-tuikuanguanli"
            },
            {
                name: "选择宝贝",
                default: true,
                component: "chooseGoods",
                path: "/chooseGoods",
                icon: "iconfont-tuikuanguanli"
            }
        ]
    }
];
export const defaultPath = "/tradeManagement/chooseGoods";
