import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface TimeWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TimeWarningModal({ isOpen, onClose }: TimeWarningModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Time Warning"
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>
            Warning: Less than 1 minute remaining!
            The quiz will be automatically submitted when time runs out.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>
            I understand
          </Button>
        </div>
      </div>
    </Modal>
  );
}