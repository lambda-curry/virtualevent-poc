import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { connect } from "react-redux";
import URI from "urijs"

import {
    getAccessToken
} from 'openstack-uicore-foundation/lib/methods';

// these two libraries are client-side only
import RegistrationLiteWidget from 'summit-registration-lite/dist';

import { FragmentParser } from "openstack-uicore-foundation/lib/components";

import { doLogin, passwordlessStart } from 'openstack-uicore-foundation/lib/methods'
import { getEnvVariable, SUMMIT_API_BASE_URL, OAUTH2_CLIENT_ID, REGISTRATION_BASE_URL } from '../utils/envVariables'

import { getUserProfile, setPasswordlessLogin, setUserOrder } from "../actions/user-actions";
import { getThirdPartyProviders } from "../actions/base-actions";

import 'summit-registration-lite/dist/index.css';
import styles from '../styles/lobby-hero.module.scss'

const RegistrationLiteComponent = ({
    registrationProfile,
    userProfile,
    getThirdPartyProviders,
    thirdPartyProviders,
    getUserProfile,
    setPasswordlessLogin,
    setUserOrder,
    loadingProfile,
    loadingIDP,
    summit,
    colorSettings,
    siteSettings }) => {

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const fragmentParser = new FragmentParser();
        setIsActive(fragmentParser.getParam('registration'));
        getThirdPartyProviders();
    }, [getThirdPartyProviders]);


    const getBackURL = () => {
        let backUrl = '/#registration=1';
        return URI.encode(backUrl);
    };

    const onClickLogin = (provider) => {
        doLogin(getBackURL(), provider);
    };

    const formatThirdPartyProviders = (providers_array) => {
        const providers = [
            { button_color: '#082238', provider_label: 'FNid' },
        ];

        const thirdPartyProviders = [
            { button_color: '#0370C5', provider_label: 'Facebook', provider_param: 'facebook' },
            { button_color: '#DD4437', provider_label: 'Google', provider_param: 'google' },
            { button_color: '#000000', provider_label: 'Apple ID', provider_param: 'apple' },
            { button_color: '#3FA2F7', provider_label: 'LinkedIn', provider_param: 'linkedin' },
            { button_color: '#2272E7', provider_label: 'Microsoft', provider_param: 'microsoft' },
        ];

        return [...providers, ...thirdPartyProviders.filter(p => providers_array?.includes(p.provider_param))];
    };

    const getPasswordlessCode = (email) => {
        const params = {
            connection: "email",
            send: "code",
            email
        };

        return passwordlessStart(params)
    };

    const loginPasswordless = (code, email) => {
        const params = {
            connection: "email",
            otp: code,
            email
        };

        navigate('/#registration=1');

        return setPasswordlessLogin(params);
    };

    const widgetProps = {
        apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
        clientId: getEnvVariable(OAUTH2_CLIENT_ID),
        summitData: summit,
        profileData: registrationProfile,
        marketingData: colorSettings,
        loginOptions: formatThirdPartyProviders(thirdPartyProviders),
        loading: loadingProfile || loadingIDP,
        ticketOwned: userProfile?.summit_tickets?.length > 0,
        authUser: (provider) => onClickLogin(provider),
        getPasswordlessCode: getPasswordlessCode,
        loginWithCode: async (code, email) => await loginPasswordless(code, email),
        getAccessToken: getAccessToken,
        closeWidget: async () => {
            // reload user profile
            await getUserProfile();
            setIsActive(false)
        },
        goToExtraQuestions: async () => {
            // reload user profile
            await getUserProfile();
            navigate('/a/extra-questions')
        },
        goToEvent: () => navigate('/a/'),
        goToRegistration: () => navigate(`${getEnvVariable(REGISTRATION_BASE_URL)}/a/${summit.slug}`),
        onPurchaseComplete: (order) => {
            window.setTimeout(() => setUserOrder(order), 5000);
        },
        inPersonDisclaimer: siteSettings?.registration_in_person_disclaimer
    };

    const { registerButton } = siteSettings.heroBanner.buttons;

    return (
        <>
            {!userProfile?.summit_tickets?.length > 0 &&
                <button className={`${styles.button} button is-large`} onClick={() => setIsActive(true)}>
                    <i className={`fa fa-2x fa-edit icon is-large`} />
                    <b>{registerButton.text}</b>
                </button>
            }
            <div>
                {isActive && <RegistrationLiteWidget {...widgetProps} />}
            </div>
        </>
    )
};


const mapStateToProps = ({ userState, summitState, settingState }) => ({
    registrationProfile: userState.idpProfile,
    userProfile: userState.userProfile,
    loadingProfile: userState.loading,
    loadingIDP: userState.loadingIDP,
    thirdPartyProviders: summitState.third_party_providers,
    summit: summitState.summit,
    colorSettings: settingState.colorSettings,
    siteSettings: settingState.siteSettings,
});

export default connect(mapStateToProps, {
    getThirdPartyProviders,
    getUserProfile,
    setPasswordlessLogin,
    setUserOrder,
})(RegistrationLiteComponent)
