import React, { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Text, 
  TouchableHighlight
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { LoginButton, AccessToken, ShareDialog, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { Card, Image } from 'react-native-elements'

const App = () => {

  const [profile, setProfile] = useState([]);
  const [profileImage, setProfileImage] = useState();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const SHARE_LINK_CONTENT = {
    contentType: 'link',
    contentUrl: 'https://www.facebook.com/',
  };

  getPublicProfile = async () => {
    const infoRequest = new GraphRequest(
      '/me?fields=id,name,picture',
      null,
      (error, result) => {
        if (error) {
          console.log('Error fetching data: ' + error.toString());
        } else {
          console.log(result);
          setProfile(result);
          setProfileImage(result.picture.data.url);
        }
      }
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  shareLinkWithDialog = async () => {
    const canShow = await ShareDialog.canShow(SHARE_LINK_CONTENT);
    if (canShow) {
      try {
        const {isCancelled, postId} = await ShareDialog.show(
          SHARE_LINK_CONTENT,
        );
        if (isCancelled) {
          Alert.alert('Share cancelled');
        } else {
          Alert.alert('Share success with postId: ' + postId);
        }
      } catch (error) {
        Alert.alert('Share fail with error: ' + error);
      }
    }
  };
  
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View>
            <LoginButton
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    setLoggedIn(true);
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log(data.accessToken.toString());
                        this.getPublicProfile();
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => {
                console.log("logout.");
                setLoggedIn(false);
              }}/>
            { isLoggedIn && <Card
                title={profile.name}>
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 50, height: 50 }}
                />
                <TouchableHighlight onPress={this.shareLinkWithDialog}>
                  <Text style={styles.shareText}>Share link with ShareDialog</Text>
                </TouchableHighlight>
              </Card> 
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
