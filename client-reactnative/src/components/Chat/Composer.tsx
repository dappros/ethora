import React, { useMemo } from "react"
import { Composer, ComposerProps } from "react-native-gifted-chat"
import {
  MentionPartType,
  PartType,
  Position,
  Suggestion,
} from "../../helpers/chat/inputTypes"
import {
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  isMentionPartType,
  parseValue,
} from "../../helpers/chat/inputUtils"

interface IChatComposer extends ComposerProps {
  partTypes: PartType[]
  selection: Position
  onTextChanged: (text: string) => void
  text: string
}

export const ChatComposer: React.FC<IChatComposer> = ({
  partTypes,
  onTextChanged,
  selection,
  text,
  ...props
}) => {
  const { plainText, parts } = useMemo(
    () => parseValue(text, partTypes),
    [text, partTypes]
  )
  const onChangeInput = (changedText: string) => {
    onTextChanged(
      generateValueFromPartsAndChangedText(parts, plainText, changedText)
    )
  }
  const keywordByTrigger = useMemo(() => {
    return getMentionPartSuggestionKeywords(
      parts,
      plainText,
      selection,
      partTypes
    )
  }, [parts, plainText, selection, partTypes])

  const onSuggestionPress =
    (mentionType: MentionPartType) => (suggestion: Suggestion) => {
      const newValue = generateValueWithAddedSuggestion(
        parts,
        mentionType,
        plainText,
        selection,
        suggestion
      )

      if (!newValue) {
        return
      }
      onTextChanged(newValue)
    }
  const renderMentionSuggestions = (mentionType: MentionPartType) => {
    return (
      <React.Fragment key={mentionType.trigger}>
        {mentionType.renderSuggestions &&
          mentionType.renderSuggestions({
            keyword: keywordByTrigger[mentionType.trigger],
            onSuggestionPress: onSuggestionPress(mentionType),
          })}
      </React.Fragment>
    )
  }
  return (
    <>
      {(
        partTypes.filter(
          (one) => isMentionPartType(one) && one.renderSuggestions != null
        ) as MentionPartType[]
      ).map(renderMentionSuggestions)}
      <Composer
        text={plainText}
        multiline={true}
        onTextChanged={(changedText) => onChangeInput(changedText)}
        {...props}
      />
    </>
  )
}
