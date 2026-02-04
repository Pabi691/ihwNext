import React, { useCallback, useEffect, useState } from 'react';
import { useGlobal } from '../../global/GlobalContext';
import { Link } from '@/components/compat/router';
import compressImage from '../../utils/compressImage';

const AllCatMobile = ({slug}) => {
    const [trend, setTrend] = useState([]);
    const { token } = useGlobal();

    const fetchCat = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/${slug}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setTrend(data.category_data.child_categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, [token, slug]);

    useEffect(() => {
        fetchCat();
    }, [fetchCat]);

    // Function to split array into chunks of two
    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const chunks = chunkArray(trend, 2); // Split into chunks of 2

    return (
        <div className='my-4'>
            <h2 className='font-semibold text-sm mb-3'>Trending Categories {slug}</h2>
            <div className="flex gap-2 overflow-scroll">
                {chunks.map((chunk, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        {chunk.map((item) => (
                            <Link to={`${item.slug}`}
                                key={item.id}
                                className="rounded-lg w-[150px] h-[175px] relative need_below_overley"
                            >
                                <img
                                src={compressImage(item.cat_img, 400, 70, 'webp')}
                                alt={item.category_name}
                                className='w-full h-full object-cover rounded-xl' loading="lazy"
                                />
                                {/* <div className="text-center text-xs text-white font-semibold absolute bottom-2 w-full">
                                    {item.category_name}
                                </div> */}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllCatMobile;

