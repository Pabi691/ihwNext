import React from "react";
import { useParams } from "@/components/compat/router";
import { branchData } from "../../content/branchData";
import ProductCategory from "../home/ProductCategory";

const BranchContent = () => {

    const { branch } = useParams();
    const data = branchData[branch];

    return (
        <>
            <h2 className="text-center mt-14 mb-10 text-6xl w-[80%] m-auto">{data.page_title}</h2>
            <p className="text-center mb-10 text-xl w-[80%] m-auto">
                We provide expert non surgical hair replacement in {data.name} including hair topper, extensions, and hair patch for instant volume and confidence.
            </p>
            <img src={data.banner_img} alt={data.name} />
            {data.component}
            <ProductCategory
                title={
                    <>
                        SHOP FROM <span className="text-red-500">OUR COLLECTION</span>
                    </>
                }
            />
            {data.menProduct}
            {data.womenProduct}
            {data.reviews}
        </>
    )
}

export default BranchContent;
