import React, {useMemo, useState} from 'react';
import {Composer, ComposerProps} from 'react-native-gifted-chat';
import {
  MentionInputProps,
  MentionPartType,
  Suggestion,
} from '../../helpers/chat/inputTypes';
import {
  defaultMentionTextStyle,
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  isMentionPartType,
  mentionRegEx,
  parseValue,
} from '../../helpers/chat/inputUtils';

export const ChatComposer = ({
  partTypes,
  onTextChanged,
  selection,
  text,
  ...props
}: ComposerProps) => {
  const {plainText, parts} = useMemo(
    () => parseValue(text, partTypes),
    [text, partTypes],
  );
  const onChangeInput = changedText => {

    onTextChanged(
      generateValueFromPartsAndChangedText(parts, plainText, changedText),
    );
  };
  const keywordByTrigger = useMemo(() => {
    return getMentionPartSuggestionKeywords(
      parts,
      plainText,
      selection,
      partTypes,
    );
  }, [parts, plainText, selection, partTypes]);

  const onSuggestionPress =
    (mentionType: MentionPartType) => (suggestion: Suggestion) => {
      const newValue = generateValueWithAddedSuggestion(
        parts,
        mentionType,
        plainText,
        selection,
        suggestion,
      );

      if (!newValue) {
        return;
      }
      onTextChanged(newValue);
    };
  const renderMentionSuggestions = (mentionType: MentionPartType) => {
    return (
      <React.Fragment key={mentionType.trigger}>
        {mentionType.renderSuggestions &&
          mentionType.renderSuggestions({
            keyword: keywordByTrigger[mentionType.trigger],
            onSuggestionPress: onSuggestionPress(mentionType),
          })}
      </React.Fragment>
    );
  };
  return (
    <>
      {(
        partTypes.filter(
          one => isMentionPartType(one) && one.renderSuggestions != null,
        ) as MentionPartType[]
      ).map(renderMentionSuggestions)}
      <Composer
        text={plainText}
        multiline={true}
        onTextChanged={text => onChangeInput(text)}
        {...props}
      />
    </>
  );
};
