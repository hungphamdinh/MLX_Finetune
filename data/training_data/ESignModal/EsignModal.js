import React from 'react';
import _ from 'lodash';

import CheckBoxModal from '../../../Modal/CheckBoxModal';
import useJobRequest from '../../../Context/JobRequest/Hooks/UseJobRequest';
import NavigationService from '@NavigationService';
import useUser from '../../../Context/User/Hooks/UseUser';
import { JR_SIGN_TYPE } from '../../../Config/Constants';

const ESignModal = ({ jrData, reloadData }) => {
  const {
    jobRequest: { signingVisible, previewVisible },
    setVisiblePreviewModal,
    setVisibleSigningModal,
    uploadJRFileSignature,
    viewReport,
  } = useJobRequest();

  const {
    user: { user, tenant },
  } = useUser();

  const haveOfficeSigning = jrData?.signature.findIndex((item) => item.title === JR_SIGN_TYPE.OFFICE_SIGNING) > -1;
  const haveMaintenanceSigning = jrData?.signature.findIndex((item) => item.title === JR_SIGN_TYPE.MAINTENANCE_SIGNING) > -1;

  const signOffice = () => {
    // onSignOffice();
  };

  const signMaintenance = () => {
    // onSignMaintenance();
  };

  const onSubmitSign = (val) => {
    NavigationService.navigate('commonSignature', {
      signingName: user.displayName,
      disabledName: true,
      onSubmit: (signature) => {
        const newSignature = {
          ...signature,
          title: val.name,
        };
        uploadJRFileSignature(newSignature, jrData.guid, reloadData);
      },
    });
  };

  const onSubmitPreview = (val) => {
    const isNUS = tenant.id === 401;
    viewReport({
      id: jrData.id,
      isSimple: val.isSimple,
      isNUS,
    });
  };
  const eSignOptions = [
    {
      title: 'JR_E_SIGN_OFFICE',
      name: JR_SIGN_TYPE.OFFICE_SIGNING,
      isCheck: !haveOfficeSigning,
      disabled: haveOfficeSigning,
      id: 1,
    },
    {
      title: 'JR_E_SIGN_MAINTENANCE',
      name: JR_SIGN_TYPE.MAINTENANCE_SIGNING,
      isCheck: !haveMaintenanceSigning && haveOfficeSigning,
      disabled: haveMaintenanceSigning,
      id: 2,
    },
  ];

  const reportOptions = [
    {
      title: 'JR_FORM_E_SIGN_SIMPLE',
      onPress: () => signOffice(),
      isSimple: true,
      isCheck: true,
      id: 1,
    },
    {
      title: 'JR_FORM_E_SIGN_DETAIL',
      onPress: () => signMaintenance(),
      isSimple: false,
      isCheck: false,
      id: 2,
    },
  ];
  return (
    <>
        {signingVisible || previewVisible ? (
            <CheckBoxModal
              title={signingVisible ? 'JR_E_SIGN_MODAL' : 'JR_PREVIEW_REPORT'}
              onClosePress={() => (signingVisible ? setVisibleSigningModal(false) : setVisiblePreviewModal(false))}
              onSubmit={signingVisible ? onSubmitSign : onSubmitPreview}
              buttonTitle={signingVisible ? 'COMMON_SIGN' : 'JR_VIEW_REPORT'}
              data={signingVisible ? eSignOptions : reportOptions}
            />
      ) : null}
    </>
  );
};

export default ESignModal;
