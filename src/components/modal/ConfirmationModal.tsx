'use client';

import { Button, Modal } from '@heroui/react';
import type { ReactNode } from 'react';

type ConfirmationModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  onConfirm: () => void;
};

export function ConfirmationModal({ isOpen, onOpenChange, title, description, confirmText = 'Konfirmasi', cancelText = 'Batal', icon, onConfirm }: ConfirmationModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-105">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-default text-foreground">{icon}</Modal.Icon>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p>{description}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="w-full" onPress={() => onOpenChange(false)}>
              {cancelText}
            </Button>
            <Button variant="danger" className="w-full" onPress={onConfirm}>
              {confirmText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
