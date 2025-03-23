import React from 'react';
import ContentLoader from 'react-content-loader';

const TableSkeletonLoader = (props) => {
    const rows = Array.from({ length: props.length || 10 });
    const rowHeight = props.rowHeight || 40; 
    const gap = props.gap || 10; 

    return (
        <ContentLoader
            speed={1}
            width="100%"
            height={(rowHeight + gap) * rows.length} 
            viewBox={`0 0 100% ${(rowHeight + gap) * rows.length}`}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
        >
            {rows.map((_, index) => (
                <rect
                    x="0"
                    y={index * (rowHeight + gap)}
                    rx="5"
                    ry="5"
                    width="100%"
                    height={rowHeight}
                    key={index}
                />
            ))}
        </ContentLoader>
    );
};

export default TableSkeletonLoader;