import React from "react";
import { useParams } from "@/components/compat/router";
import { branchData } from "../../content/branchData";
import ProductCategory from "../home/ProductCategory";
import BranchMap from "./BranchMap";
import BranchFaq from "./BranchFaq";

const BranchContent = () => {

    const { branch } = useParams();
    const data = branchData[branch];

    return (
        <>
            <img src={data.banner_img} alt={`Indian Hair World ${data.name} branch - hair replacement services`} />
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
            <BranchMap data={data} />
            <BranchFaq faqs={data.faqs} />
        </>
    )
}

export default BranchContent;
