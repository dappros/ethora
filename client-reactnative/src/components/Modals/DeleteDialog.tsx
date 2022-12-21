import React from 'react';
import {AlertDialog, Center, Button as NativeButton} from 'native-base';
import {Button} from '../Button';

export const DeleteDialog = ({
  open,
  onClose,
  onDeletePress,
  loading,
  title,
  description,
  deleteButtonTitle,
  cancelButtonTitle,
}: {
  open: boolean;
  onClose: () => void;
  onDeletePress: () => void;
  loading: boolean;
  title: string;
  description: string;
  deleteButtonTitle?: string;
  cancelButtonTitle?: string;
}) => {
  const cancelRef = React.useRef(null);
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={open}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{title}</AlertDialog.Header>
          <AlertDialog.Body>{description}</AlertDialog.Body>
          <AlertDialog.Footer>
            <NativeButton.Group space={2}>
              <NativeButton
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                {cancelButtonTitle || 'Cancel'}
              </NativeButton>
              <Button
                title={deleteButtonTitle || 'Delete'}
                style={{
                  backgroundColor: 'red',
                }}
                loading={loading}
                onPress={onDeletePress}
              />
            </NativeButton.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};
