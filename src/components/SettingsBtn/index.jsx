import React from 'react';
import css from './SettingsBtn.module.css';
import Settings from '../../images/settings.svg';

const SettingsBtn = (props) => {
    return (
        <button onClick={props.onclick} className={css.btn}>
            <img alt="setting" src={Settings} />
        </button>
    )
}

export default SettingsBtn;