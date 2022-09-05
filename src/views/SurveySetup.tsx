import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeContext } from '../store/treeStore/treeStore';
import { createUrlUUID } from '../helpers/uriHelper';
import Btn from '../components/Btn/Btn';
import FormField from '../components/FormField/FormField';
import { IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import './SurveySetup.css'

const SurveySetup = () => {

    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const [url, setURL] = useState(state.qMetadata.url || createUrlUUID());

    const updateMeta = (
        propName: IQuestionnaireMetadataType,
        value: string,
    ) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    return (
        <div className="metadata-message-container">
            <p className="metadata-message-header">
                New Survey Setup
            </p>
            <div className="metadata-input">
            <p><strong>Enter a unique URL that will be used as an identifier for this survey in your app.</strong>
                <br /><br />
                (It's OK if this is not a real address on the web.)</p>
            <FormField>
                <input
                    style={{ color: 'black' }}
                    defaultValue={url}
                    placeholder={t('Enter a unique URL for your survey here')}
                    onBlur={(e) => setURL(e.target.value)}
                    pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                />
            </FormField>
            <br />
            <Btn
                onClick={() => {
                    updateMeta(IQuestionnaireMetadataType.url, url);
                }}
                title={t('Save and Continue')}
                variant="primary"
            />
            </div>
        </div>
    )
}

export default SurveySetup;