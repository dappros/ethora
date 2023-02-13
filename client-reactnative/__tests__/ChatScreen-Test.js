import React from 'react';
import renderer from 'react-test-renderer';
import ChatScreen from '../src/Screens/ChatScreen';

test('renders correctly', () => {
    const ChatScreenInstance = renderer.create(<ChatScreen />).getInstance();
    // expect(tree).toMatchSnapshot();

    // expect(ChatScreenInstance.)

});