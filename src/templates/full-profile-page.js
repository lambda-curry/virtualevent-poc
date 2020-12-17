import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import { epochToMomentTimeZone } from "openstack-uicore-foundation/lib/methods";
import { AjaxLoader, CountryInput, LanguageInput, DateTimePicker } from 'openstack-uicore-foundation/lib/components'
import moment from "moment-timezone";

import Layout from '../components/Layout'
import withOrchestra from "../utils/widgetOrchestra";

import SummitObject from '../content/summit.json';

import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import ProfilePopupComponent from '../components/ProfilePopupComponent'

import { updateProfilePicture, updateProfile, getIDPProfile } from '../actions/user-actions'

import styles from '../styles/full-profile.module.scss'

export const FullProfilePageTemplate = ({ loggedUser, user, getIDPProfile, updateProfile, updateProfilePicture, addWidgetRef, updateWidgets }) => {

    const [showProfile, setShowProfile] = useState(false);
    const [personalProfile, setPersonalProfile] = useState({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        birthday: '',
        gender: '',
        specifyGender: '',
        irc: '',
        github: '',
        twitter: '',
        linkedin: '',
        identifier: '',
        language: ''
    })

    // const [showFullName, setShowFullName] = useState(undefined)
    // const [showPicture, setShowPicture] = useState(undefined)
    // const [showEmail, setShowEmail] = useState(undefined)
    const [bio, setBio] = useState('')

    const [address, setAddress] = useState({
        street: '',
        floor: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    })

    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!user.idpProfile) {
            getIDPProfile();
        } else {
            setImage(user.idpProfile.picture)
            setPersonalProfile({
                firstName: user.idpProfile.given_name || '',
                lastName: user.idpProfile.family_name || '',
                company: user.idpProfile.company || '',
                email: user.idpProfile.email || '',
                birthday: user.idpProfile.birthdate?.date ? moment(user.idpProfile.birthdate.date).valueOf() / 1000 : null,
                gender: user.idpProfile.gender || '',
                specifyGender: '',
                irc: user.idpProfile.irc || '',
                github: user.idpProfile.github_user || '',
                twitter: user.idpProfile.twitter_user || '',
                linkedin: user.idpProfile.linked_in_profile || '',
                identifier: user.idpProfile.nickname || '',
                language: user.idpProfile.locale || ''
            });
            // setShowFullName(undefined);
            // setShowPicture(undefined);
            // setShowEmail(undefined);
            setBio(user.idpProfile.bio || '');
            setAddress({
                street: user.idpProfile.street_address || '',
                floor: user.idpProfile.street_address2 || '',
                city: user.idpProfile.locality || '',
                state: user.idpProfile.region || '',
                zipCode: user.idpProfile.postal_code || '',
                country: user.idpProfile.country || '',
                phone: user.idpProfile.phone_number || ''
            });
        }
        return () => {
            setPersonalProfile({
                firstName: '',
                lastName: '',
                company: ''
            });
        };
    }, [user.idpProfile]);

    const handlePictureUpdate = (picture) => {
        updateProfilePicture(picture);
    }

    const handleProfileUpdate = (profile) => {
        if (profile) {
            updateProfile(profile)
        } else {
            const newProfile = {
                first_name: personalProfile.firstName,
                last_name: personalProfile.lastName,
                company: personalProfile.company,
                email: personalProfile.email,
                birthday: personalProfile.birthday,
                gender: personalProfile.gender,
                gender_specify: personalProfile.gender === 'Specify' ? personalProfile.specifyGender : null,
                irc: personalProfile.irc,
                github_user: personalProfile.github,
                twitter_name: personalProfile.twitter,
                linked_in_profile: personalProfile.linkedin,
                identifier: personalProfile.identifier,
                language: personalProfile.language,
                // public_profile_show_fullname: showFullName,
                // public_profile_show_photo: showPicture,
                // public_profile_show_email: showEmail,
                bio: bio,
                address1: address.street,
                address2: address.floor,
                city: address.city,
                state: address.state,
                post_code: address.zipCode,
                country_iso_code: address.country,
                phone_number: address.phone,
            }
            updateProfile(newProfile);
        }
    }

    const handleTogglePopup = (profile) => {
        if (profile) {
            document.body.classList.add('is-clipped');
        } else {
            document.body.classList.remove('is-clipped');
        }
        setShowProfile(profile)
    }

    const onEventChange = (ev) => {
        navigate(`/a/event/${ev.id}`);
    }

    const onViewAllEventsClick = () => {
        navigate('/a/schedule')
    }

    const discardChanges = (state) => {
        switch (state) {
            case 'profile':
                setPersonalProfile({
                    firstName: user.idpProfile.given_name,
                    lastName: user.idpProfile.family_name,
                    company: user.idpProfile.company || '',
                    email: user.idpProfile.email || '',
                    birthday: user.idpProfile.birthdate?.date ? moment(user.idpProfile.birthdate.date).valueOf() / 1000 : null,
                    gender: user.idpProfile.gender || '',
                    specifyGender: '',
                    irc: user.idpProfile.irc || '',
                    github: user.idpProfile.github_user || '',
                    twitter: user.idpProfile.twitter_user || '',
                    linkedin: user.idpProfile.linked_in_profile || '',
                    identifier: user.idpProfile.nickname || '',
                    language: user.idpProfile.locale || ''
                });
                // setShowFullName(undefined);
                // setShowPicture(undefined);
                // setShowEmail(undefined);   
                break;
            case 'bio':
                setBio(user.idpProfile.bio || '');
                break;
            case 'address':
                setAddress({
                    street: user.idpProfile.street_address || '',
                    floor: user.idpProfile.street_address2 || '',
                    city: user.idpProfile.locality || '',
                    state: user.idpProfile.region || '',
                    zipCode: user.idpProfile.postal_code || '',
                    country: user.idpProfile.country || '',
                    phone: user.idpProfile.phone_number || ''
                });
                break;
            default:
                return;
        }
    }

    return (
        <React.Fragment>
            <AjaxLoader relative={false} color={'#ffffff'} show={user.loadingIDP} size={120} />
            <div className="px-6 py-6 mb-6">
                <div className={`columns is-3 ${styles.fullProfile}`} >
                    <div className="column is-3">
                        <div className={styles.profilePicture} onClick={() => handleTogglePopup(!showProfile)}>
                            <img src={image} />
                        </div>
                        <h3>
                            Hello, <br />
                            {personalProfile.firstName} {personalProfile.lastName}
                        </h3>
                        <h4>
                            @{user.idpProfile?.nickname}
                        </h4>
                    </div>
                    <div className="column">
                        <div className={styles.formContainer}>
                            <div className={styles.header}>Personal Profile</div>
                            <div className={styles.form}>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>First Name</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="First Name"
                                            onChange={e => setPersonalProfile({ ...personalProfile, firstName: e.target.value })}
                                            value={personalProfile.firstName}
                                        />
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Last Name</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Last Name"
                                            onChange={e => setPersonalProfile({ ...personalProfile, lastName: e.target.value })}
                                            value={personalProfile.lastName}
                                        />
                                    </div>
                                </div>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Company</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Company"
                                            onChange={e => setPersonalProfile({ ...personalProfile, company: e.target.value })}
                                            value={personalProfile.company}
                                        />
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Email</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Email"
                                            onChange={e => setPersonalProfile({ ...personalProfile, email: e.target.value })}
                                            value={personalProfile.email}
                                        />
                                    </div>
                                </div>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Birthday</b>
                                        <div className="columns field">
                                            <div className={`column ${styles.control}`}>
                                                <DateTimePicker
                                                    onChange={e => setPersonalProfile({ ...personalProfile, birthday: (e.target.value.valueOf() / 1000) })}
                                                    format={{ date: 'MM/DD/YYYY', time: '' }}
                                                    value={epochToMomentTimeZone(moment(personalProfile.birthday), SummitObject.summit.time_zone_id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Gender</b>
                                        <div className={styles.control}>
                                            <div className={`${styles.select} ${styles.isLarge}`}>
                                                <select
                                                    onChange={e => setPersonalProfile({ ...personalProfile, gender: e.target.value })}
                                                    value={personalProfile.gender}
                                                >
                                                    <option>Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Prefer not to say">Prefer not to say</option>
                                                    <option value="Specify">Let me specify</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {personalProfile.gender === 'Specify' &&
                                    <>
                                        <div className={`columns is-mobile ${styles.inputRow}`}>
                                            <div className={`column is-half ${styles.inputField}`}></div>                                        
                                            <div className={`column is-half ${styles.inputField}`}>
                                                <b>Specify gender</b>
                                                <input
                                                    className={`${styles.input} ${styles.isLarge}`}
                                                    type="text"
                                                    placeholder="Specify your gender"
                                                    onChange={e => setPersonalProfile({ ...personalProfile, specifyGender: e.target.value })}
                                                    value={personalProfile.specifyGender}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>IRC</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="IRC"
                                            onChange={e => setPersonalProfile({ ...personalProfile, irc: e.target.value })}
                                            value={personalProfile.irc}
                                        />
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Github</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Github"
                                            onChange={e => setPersonalProfile({ ...personalProfile, github: e.target.value })}
                                            value={personalProfile.github}
                                        />
                                    </div>
                                </div>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Twitter</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Twitter"
                                            onChange={e => setPersonalProfile({ ...personalProfile, twitter: e.target.value })}
                                            value={personalProfile.twitter}
                                        />
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Linkedin</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Linkedin"
                                            onChange={e => setPersonalProfile({ ...personalProfile, linkedin: e.target.value })}
                                            value={personalProfile.linkedin}
                                        />
                                    </div>
                                </div>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Identifier</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Identifier"
                                            onChange={e => setPersonalProfile({ ...personalProfile, identifier: e.target.value })}
                                            value={personalProfile.identifier}
                                        />
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Language</b>
                                        <LanguageInput
                                            onChange={e => setPersonalProfile({ ...personalProfile, language: e.target.value })}
                                            value={personalProfile.language}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <label className={styles.checkbox}>
                                    <input type="checkbox" value={showFullName} onChange={e => setShowFullName(e.target.value)} />
                                Show full name on public profile
                                </label>
                                <br />
                                <label className={styles.checkbox}>
                                    <input type="checkbox" value={showPicture} onChange={e => setShowPicture(e.target.value)} />
                                Show picture on public profile
                                </label>
                                <br />
                                <label className={styles.checkbox}>
                                    <input type="checkbox" value={showEmail} onChange={e => setShowEmail(e.target.value)} />
                                Show email on public profile
                                </label> */}
                            <div className={styles.buttons}>
                                <button className="button is-large" onClick={() => discardChanges('profile')}>Discard</button>
                                <button className="button is-large" onClick={() => handleProfileUpdate()}>Update</button>
                            </div>
                        </div>
                        <div className={styles.formContainer}>
                            <div className={styles.header}>Bio</div>
                            <div className={styles.form}>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-full ${styles.inputField}`}>
                                        <textarea
                                            className={`textarea ${styles.textarea}`}
                                            placeholder=''
                                            rows="6"
                                            onChange={e => setBio(e.target.value)}
                                            value={bio}
                                        >
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <button className="button is-large" onClick={() => discardChanges('bio')}>Discard</button>
                                <button className="button is-large" onClick={() => handleProfileUpdate()}>Update</button>
                            </div>
                        </div>
                        <div className={styles.formContainer}>
                            <div className={styles.header}>Address</div>
                            <div className={styles.form}>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Address</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Complete your address"
                                            onChange={e => setAddress({ ...address, street: e.target.value })}
                                            value={address.street}
                                        />
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Address 2</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Complete your address"
                                            onChange={e => setAddress({ ...address, floor: e.target.value })}
                                            value={address.floor}
                                        />
                                    </div>
                                </div>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>City</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Complete your city"
                                            onChange={e => setAddress({ ...address, city: e.target.value })}
                                            value={address.city}
                                        />
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>State</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Complete your state"
                                            onChange={e => setAddress({ ...address, state: e.target.value })}
                                            value={address.state}
                                        />
                                    </div>
                                </div>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Zip Code</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Complete your zip code"
                                            onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                                            value={address.zipCode}
                                        />
                                    </div>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Country</b>
                                        <CountryInput
                                            onChange={e => setAddress({ ...address, country: e.target.value })}
                                            value={address.country}
                                        />
                                    </div>
                                </div>
                                <div className={`columns is-mobile ${styles.inputRow}`}>
                                    <div className={`column is-half ${styles.inputField}`}>
                                        <b>Phone</b>
                                        <input
                                            className={`${styles.input} ${styles.isLarge}`}
                                            type="text"
                                            placeholder="Complete your phone"
                                            onChange={e => setAddress({ ...address, phone: e.target.value })}
                                            value={address.phone}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <button className="button is-large" onClick={() => discardChanges('address')}>Discard</button>
                                <button className="button is-large" onClick={() => handleProfileUpdate()}>Update</button>
                            </div>
                        </div>
                    </div>
                    <div className="column is-3">
                        <div className={styles.header}>My Schedule</div>
                        <ScheduleLiteComponent
                            accessToken={loggedUser.accessToken}
                            onEventClick={(ev) => onEventChange(ev)}
                            onViewAllEventsClick={() => onViewAllEventsClick()}
                            title=''
                            landscape={true}
                            yourSchedule={true}
                            showNav={true}
                            eventCount={10}
                            slotCount={1}
                            onRef={addWidgetRef}
                            updateCallback={updateWidgets}
                        />
                    </div>
                </div>
            </div>
            {showProfile &&
                <ProfilePopupComponent
                    userProfile={user.idpProfile}
                    showProfile={showProfile}
                    idpLoading={user.loadingIDP}
                    fromFullProfile={true}
                    changePicture={(pic) => handlePictureUpdate(pic)}
                    changeProfile={(profile) => handleProfileUpdate(profile)}
                    closePopup={() => handleTogglePopup(!showProfile)}
                />
            }
        </React.Fragment >
    )
};

const OrchestedTemplate = withOrchestra(FullProfilePageTemplate);

const FullProfilePage = (
    {
        location,
        loggedUser,
        user,
        getIDPProfile,
        updateProfile,
        updateProfilePicture,
    }
) => {
    return (
        <Layout location={location}>
            <OrchestedTemplate
                loggedUser={loggedUser}
                user={user}
                getIDPProfile={getIDPProfile}
                updateProfile={updateProfile}
                updateProfilePicture={updateProfilePicture} />
        </Layout>
    )
}

FullProfilePage.propTypes = {
    loggedUser: PropTypes.object,
    user: PropTypes.object,
    getIDPProfile: PropTypes.func,
    updateProfile: PropTypes.func,
    updateProfilePicture: PropTypes.func,
}

FullProfilePageTemplate.propTypes = {
    loggedUser: PropTypes.object,
    user: PropTypes.object,
    getIDPProfile: PropTypes.func,
    updateProfile: PropTypes.func,
    updateProfilePicture: PropTypes.func,
}

const mapStateToProps = ({ loggedUserState, userState }) => ({
    loggedUser: loggedUserState,
    user: userState,
})

export default connect(mapStateToProps,
    {
        getIDPProfile,
        updateProfile,
        updateProfilePicture
    }
)(FullProfilePage);