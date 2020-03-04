import React from 'react';
import css from './InfoBtn.module.css';
import Info from '../../images/info.svg';

const InfoBtn = (props) => {
    return (
        <button onClick={props.onclick} className={css.btn}>
            <img alt="setting" src={Info} />
        </button>
    )
}

export default InfoBtn;