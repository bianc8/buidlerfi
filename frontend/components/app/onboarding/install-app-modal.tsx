import { Flex } from "@/components/shared/flex";
import { IosShare } from "@mui/icons-material";
import { DialogTitle, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import { FC } from "react";

interface Props {
  close: () => void;
}

export const InstallAppModal: FC<Props> = ({ close }) => {
  return (
    <Modal open={true} onClose={close}>
      <ModalDialog minWidth="400px">
        <ModalClose />
        <Flex x xsb yc>
          <DialogTitle>Install App</DialogTitle>
        </Flex>
        <Typography level="body-sm" textColor="neutral.500">
          Add builder.fi to your home screen to get the best experience
        </Typography>
        <Flex x yc gap={2}>
          <Typography level="body-sm" textColor="neutral.500">
            1. Click the share button
          </Typography>
          <IosShare />
        </Flex>
        <Typography level="body-sm" textColor="neutral.500">
          2. Scroll down
        </Typography>
        <Typography level="body-sm" textColor="neutral.500">
          3. Click &quot;Add to Home Screen&quot;
        </Typography>
      </ModalDialog>
    </Modal>
  );
};
