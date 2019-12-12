import React from 'react';

import styles from './ContainerComponent.sss';


export default props => (
  <div className={styles.ContainerComponent}>
    <div className={styles.background}></div>
    <div className={styles.header}>
      <div className={styles.title}>{props.title}</div>
    </div>
    <div className={styles.content}>
      {props.children}
    </div>
  </div>
);