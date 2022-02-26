import React, { useState, useEffect, useMemo } from "react";

import { useTransition, animated } from '@react-spring/web'

import styles from './index.module.scss';

const NotificationHub = ({
    config = { tension: 125, friction: 20, precision: 0.1 },
    timeout = 5000,
    children,
}) => {

    let id = 0;

    const refMap = useMemo(() => new WeakMap(), [])
    const cancelMap = useMemo(() => new WeakMap(), [])
    const [items, setItems] = useState([])

    const transitions = useTransition(items, {
        from: { opacity: 0, height: 0, life: '100%' },
        keys: item => item.key,
        enter: item => async (next, cancel) => {
            cancelMap.set(item, cancel)
            await next({ opacity: 1, height: refMap.get(item).offsetHeight })
            await next({ life: '0%' })
        },
        leave: [{ opacity: 0 }, { height: 0 }],
        onRest: (result, ctrl, item) => {
            setItems(state =>
                state.filter(i => {
                    return i.key !== item.key
                })
            )
        },
        config: (item, index, phase) => key => phase === 'enter' && key === 'life' ? { duration: timeout } : config,
    })

    useEffect(() => {
        children((msg) => {
            setItems(state => [...state, { key: id++, msg }])
        })
    }, [])

    return (
        <div className={styles.container}>
            {transitions(({ life, ...style }, item) => {
                return (
                    <animated.div className={styles.message} style={style}>
                        <div className={styles.content} ref={(ref) => ref && refMap.set(item, ref)}>
                            <p>{item.msg}</p>
                            <button
                                className={styles.button}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (cancelMap.has(item) && life.get() !== '0%') cancelMap.get(item)()
                                }}>
                                <i className="fa fa-close is-large" />
                            </button>
                        </div>
                    </animated.div>
                )
            })}
        </div>
    )
}

export default NotificationHub;