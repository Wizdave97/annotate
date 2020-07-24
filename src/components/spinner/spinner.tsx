import React from 'react';
import './styles.css';

const Spinner: React.FC<any> = (props) => {
    return (
        <div className="w-full flex justify-center items-center">
            <div className="loader text-blue-500">Loading...</div>
        </div>
    )
}

export default Spinner