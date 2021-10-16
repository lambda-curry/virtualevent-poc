import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { FragmentParser } from "openstack-uicore-foundation/lib/components";
import { getAccessToken } from "openstack-uicore-foundation/lib/methods";
import {
  AttendeeToAttendeeContainer,
  permissions,
  Tracker,
} from "attendee-to-attendee-widget";
import {
  getEnvVariable,
  CHAT_API_BASE_URL,
  IDP_BASE_URL,
  STREAM_IO_API_KEY,
  STREAM_IO_SSO_SLUG,
  SUMMIT_ID,
  SUPABASE_URL,
  SUPABASE_KEY,
} from "../utils/envVariables";

import "attendee-to-attendee-widget/dist/index.css";

const sbAuthProps = {
  supabaseUrl: getEnvVariable(SUPABASE_URL),
  supabaseKey: getEnvVariable(SUPABASE_KEY),
};

const adminGroups = ["administrators", "super-admins"];

export const AttendeesWidget = ({ user, event, location }) => {
  const [loading, setLoading] = useState(true);

  //Deep linking support
  const sdcRef = useRef();
  const shcRef = useRef();
  const sqacRef = useRef();
  const ocrRef = useRef();

  const { userProfile, idpProfile } = user || {};
  const { email, groups, first_name, last_name, bio, summit_tickets } = userProfile || {};
  const { 
    picture,
    company,
    job_title,
    sub, 
    github_user,
    linked_in_profile,
    twitter_name,
    wechat_user,
    public_profile_show_fullname } = idpProfile || {};

  useEffect(() => {
    if (!user || !userProfile || !idpProfile) return;
    const fragmentParser = new FragmentParser();
    const starHelpChatParam = fragmentParser.getParam("starthelpchat");
    const starQAChatParam = fragmentParser.getParam("startqachat");
    const starDirectChatParam = fragmentParser.getParam("startdirectchat");
    const openChatRoomParam = fragmentParser.getParam("openchatroom");

    if (starHelpChatParam && shcRef.current) {
      shcRef.current.startHelpChat();
    } else if (starQAChatParam && sqacRef.current) {
      sqacRef.current.startQAChat();
    } else if (starDirectChatParam && sdcRef.current) {
      sdcRef.current.startDirectChat(starDirectChatParam);
    } else if (openChatRoomParam && ocrRef.current) {
      ocrRef.current.openChatRoom(openChatRoomParam);
    }
    setLoading(false);
  }, [user, idpProfile, userProfile]);

  if (loading) return <div style={{ margin: "20px auto", position: "relative" }}>Loading...</div>;

  const chatProps = {
    streamApiKey: getEnvVariable(STREAM_IO_API_KEY),
    apiBaseUrl: getEnvVariable(IDP_BASE_URL),
    chatApiBaseUrl: getEnvVariable(CHAT_API_BASE_URL),
    forumSlug: getEnvVariable(STREAM_IO_SSO_SLUG),
    onAuthError: (err, res) => console.log(err),
    openDir: "left",
    activity: null,
    getAccessToken: async () => {
      const accessToken = await getAccessToken();
      //console.log("AttendeesList->getAccessToken", accessToken);
      return accessToken;
    },
  };

  if (event) {
    //Widget will create this activity room or add members to it
    chatProps.activity = {
      id: event.id,
      name: event.title,
      imgUrl: event.image,
    };
  }

  const widgetProps = {
    user: {
      id: sub.toString(),
      idpUserId: sub.toString(),
      fullName: public_profile_show_fullname ? `${first_name} ${last_name}` : `${first_name}`,
      email: email,
      company: company,
      title: job_title,
      picUrl: picture,
      socialInfo: {
        githubUser: github_user,
        linkedInProfile: linked_in_profile,
        twitterName: twitter_name,
        wechatUser: wechat_user,
      },
      getBadgeFeatures: () =>
        summit_tickets
          .filter((st) => st.badge)
          .flatMap((st) => st.badge.features)
          .filter((v, i, a) => a.map((item) => item.id).indexOf(v.id) === i),
      bio: bio,
      hasPermission: (permission) => {
        const isAdmin =  groups &&
            groups.map((g) => g.code).filter((g) => adminGroups.includes(g))
                .length > 0;
        switch (permission) {
          case permissions.MANAGE_ROOMS:
            return isAdmin;
          case permissions.CHAT:
            if(isAdmin) return true;
            const accessLevels = summit_tickets
              .flatMap((x) => x.badge?.type.access_levels)
              .filter(
                (v, i, a) => a.map((item) => item.id).indexOf(v.id) === i
              ); //distinct
            if (accessLevels && accessLevels.length > 0) {
              const canChat = accessLevels
                .filter((a) => a.name)
                .map((a) => a.name.toUpperCase())
                .includes("CHAT");
              console.log(
                "AL",
                accessLevels.map((a) => a.name)
              );
              return canChat;
            }
            return false;
          default:
            return false;
        }
      },
    },
    summitId: parseInt(getEnvVariable(SUMMIT_ID)),
    height: 400,
    ...chatProps,
    ...sbAuthProps,
  };

  return (
    <div style={{ margin: "20px auto", position: "relative" }}>
      <AttendeeToAttendeeContainer
        {...widgetProps}
        ref={{ sdcRef, shcRef, sqacRef, ocrRef }}
      />
    </div>
  );
};

const AccessTracker = ({ user, isLoggedUser }) => {
  const trackerRef = useRef();
  
  useEffect(() => {
    if (!isLoggedUser) {
      trackerRef.current.signOut();
    }
  }, [isLoggedUser]);

  if (!user || !user.userProfile || !user.idpProfile) {
    console.log('A2A tracker - cannot track user')
    return null;
  }

  const { email, first_name, last_name, bio, summit_tickets } = user.userProfile;
  const {
    picture,
    company,
    job_title,
    sub,
    github_user,
    linked_in_profile,
    twitter_name,
    wechat_user,
    public_profile_show_fullname,
    public_profile_show_email,
    public_profile_allow_chat_with_me
  } = user.idpProfile;

  const widgetProps = {
    user: {
      idpUserId: sub,
      fullName: public_profile_show_fullname ? `${first_name} ${last_name}` : `${first_name}`,
      email: email,
      company: company,
      title: job_title,
      picUrl: picture,
      socialInfo: {
        githubUser: github_user,
        linkedInProfile: linked_in_profile,
        twitterName: twitter_name,
        wechatUser: wechat_user,
      },
      getBadgeFeatures: () =>
        summit_tickets
          .filter((st) => st.badge)
          .flatMap((st) => st.badge.features)
          .filter((v, i, a) => a.map((item) => item.id).indexOf(v.id) === i),
      bio: bio,
      showEmail: public_profile_show_email,
      allowChatWithMe: public_profile_allow_chat_with_me ?? true
    },
    summitId: parseInt(getEnvVariable(SUMMIT_ID)),
    ...sbAuthProps,
  };

  return <Tracker {...widgetProps} ref={trackerRef} />;
};

const mapStateToProps = ({ loggedUserState, userState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  user: userState,
});

export default connect(mapStateToProps)(AccessTracker);
