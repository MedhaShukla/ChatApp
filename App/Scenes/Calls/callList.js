import React, { Component } from 'react';
import {
    CustomView,
    CustomText,
    CustomImage,
    CustomTouchableOpacity,
    CustomTextInput
} from '../../Custom-Components';
import COLORS from '../../Constants/color.constants';
import { PhoneImage, EditImage } from '../../Config/image.config';

export default class Calls extends Component {
    render() {
        return (
            <CustomView style={{ flex: 1, backgroundColor: 'purple' }}>
                <CustomView style={{ zIndex: 10, top: 380, alignItems: 'flex-end', marginRight: 20 }}>
                    <CustomTouchableOpacity>
                        <CustomView style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.BUTTON, alignItems: 'center', justifyContent: 'center' }}>
                            <CustomImage source={PhoneImage()} style={{ width: 22, height: 22, resizeMode: 'contain', }} />
                        </CustomView>
                    </CustomTouchableOpacity>
                </CustomView>
            </CustomView>
        )
    }
}    
