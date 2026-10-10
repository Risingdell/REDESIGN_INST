import { useUI } from '@/context/UIContext';
import { Modal } from '@/components/ui/Modal';
import { EnquiryForm } from './EnquiryForm';

export default function EnquiryDrawer() {
  const { enquiry, closeEnquiry } = useUI();
  return (
    <Modal open={enquiry.open} onClose={closeEnquiry} title="Request a call-back" variant="drawer" width="520px">
      <p className="muted" style={{ marginBottom: 20 }}>
        Leave your details and an admissions counsellor will call you back — usually the same working day.
      </p>
      <EnquiryForm topic={enquiry.topic} onDone={closeEnquiry} />
    </Modal>
  );
}
