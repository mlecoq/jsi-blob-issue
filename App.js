/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  getArrayBufferForBlob,
  getBlobForArrayBuffer,
} from 'react-native-blob-jsi-helper';
import ReactNativeBlobUtil from 'react-native-blob-util';
import base64 from 'base64-js';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    (async () => {
      const filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/landscape.pdf`;

      const result = await ReactNativeBlobUtil.config({
        path: filePath,
      }).fetch(
        'GET',
        'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
      );

      if (result.respInfo.status === 200) {
        console.log('Fetching local 8k image..');
        const res = await fetch(`file://${filePath}`);

        console.log('Getting blob..');
        const blob = await res.blob();
        console.log(`Blob: ${Object.keys(blob)}..`);
        console.log('Getting ArrayBuffer..');

        console.log('Getting ArrayBuffer..');
        // @ts-expect-error performance actually exists.
        // eslint-disable-next-line no-undef
        const start = performance.now();
        const arrayBuffer = getArrayBufferForBlob(blob);
        // @ts-expect-error performance actually exists.
        // eslint-disable-next-line no-undef
        const end = performance.now();
        console.log(
          `Got ArrayBuffer in ${end - start}ms! Size: ${arrayBuffer}`,
        );

        console.log('---- 2 ', arrayBuffer);

        console.log(
          '--- 3',
          base64.toByteArray(
            await ReactNativeBlobUtil.fs.readFile(filePath, 'base64'),
          ),
        );

        // @ts-expect-error performance actually exists.
        // eslint-disable-next-line no-undef
        const newStart = performance.now();
        const newBlob = getBlobForArrayBuffer(arrayBuffer.buffer);
        // @ts-expect-error performance actually exists.
        // eslint-disable-next-line no-undef
        const newEnd = performance.now();
        console.log(
          `Converted ArrayBuffer -> Blob in ${newEnd - newStart}ms! Blob ID: ${
            // @ts-expect-error performance actually exists.
            newBlob._data?.blobId
          }`,
        );
      }
    })();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
