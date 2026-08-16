import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Input, Button, PinInput, Switch, StepProgress } from '@/components/ui';
import { useJoinEstateForm } from '../hooks/useJoinEstateForm';

/**
 * Join estate multi-step flow.
 * Fully NativeWind — only numeric style where a hook value is needed.
 */
export function JoinEstateFlow() {
  const { step, stepIndex, totalSteps, form, setField, next, back } = useJoinEstateForm();

  return (
    <SafeAreaView className="flex-1 bg-lightCream" edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-6 pt-2">
          {/* Back arrow */}
          <Pressable
            onPress={() => stepIndex === 0 ? router.back() : back()}
            className="mt-[25px] mb-[25px] self-start"
            hitSlop={12}
          >
            <MaterialIcons name="arrow-back-ios-new" size={22} color="#1A1A1A" />
          </Pressable>

          <StepProgress currentStep={stepIndex + 1} totalSteps={totalSteps} className="mb-xl" />

          {step === 'estate' && (
            <Step title="Find your estate" subtitle="Enter the Estate ID given by your admin" onNext={next} nextLabel="Continue">
              <Input label="Estate ID" placeholder="e.g. RZD-2201" value={form.estateId} onChangeText={(v) => setField('estateId', v)} />
            </Step>
          )}

          {step === 'personal' && (
            <Step title="Your details" subtitle="Tell us who you are" onNext={next} onBack={back} nextLabel="Continue">
              <View className="gap-5">
                <Input label="Full Name" value={form.fullName} onChangeText={(v) => setField('fullName', v)} />
                <Input label="Phone Number" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setField('phone', v)} />
              </View>
            </Step>
          )}

          {step === 'otp' && (
            <Step title="Verify your number" subtitle={`Enter the code sent to ${form.phone}`} onNext={next} onBack={back} nextLabel="Verify">
              <PinInput length={4} value={form.otp} onChange={(v) => setField('otp', v)} />
            </Step>
          )}

          {step === 'address' && (
            <Step title="Your address" subtitle="Where in the estate do you live?" onNext={next} onBack={back} nextLabel="Continue">
              <View className="gap-5">
                <Input label="Street" value={form.street} onChangeText={(v) => setField('street', v)} />
                <Input label="House Number" value={form.houseNumber} onChangeText={(v) => setField('houseNumber', v)} />
                <View className="flex-row items-center justify-between pt-4">
                  <Text className="font-dmsans text-body-base text-actionDark">Enable Face ID sign-in</Text>
                  <Switch value={form.enableFaceId} onValueChange={(v) => setField('enableFaceId', v)} />
                </View>
              </View>
            </Step>
          )}

          {step === 'face' && (
            <FaceCaptureStep
              uri={form.faceCaptureUri}
              onCapture={(uri) => setField('faceCaptureUri', uri)}
              onNext={next}
              onBack={back}
            />
          )}

          {step === 'pin' && (
            <PinSetupStep
              pin={form.pin}
              confirmPin={form.confirmPin}
              onChangePin={(v) => setField('pin', v)}
              onChangeConfirm={(v) => setField('confirmPin', v)}
              onBack={back}
              onComplete={() => router.replace('/(tabs)')}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ── Shared step chrome ── */
function Step({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
}) {
  return (
    <View className="flex-1">
      <Text className="mb-1 font-dmsans text-[28px] leading-8 text-actionDark">{title}</Text>
      {subtitle ? (
        <Text className="mb-6 font-dmsans text-body-base text-warmGray">{subtitle}</Text>
      ) : null}
      <View className="flex-1 pt-4">{children}</View>
      <View className="gap-3 pb-4 pt-4">
        <Button variant="default" onPress={onNext}>
          {nextLabel}
        </Button>
        {onBack ? (
          <Button variant="ghost" onPress={onBack}>
            Back
          </Button>
        ) : null}
      </View>
    </View>
  );
}

/* ── Face capture ── */
function FaceCaptureStep({
  uri,
  onCapture,
  onNext,
  onBack,
}: {
  uri: string | null;
  onCapture: (uri: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <Step title="Camera access" subtitle="We need your camera to verify your identity" onNext={requestPermission} onBack={onBack} nextLabel="Allow camera">
        <Text className="font-dmsans text-body-small text-warmGray">You can change this later in device settings.</Text>
      </Step>
    );
  }

  const handleCapture = async () => {
    const photo = await cameraRef?.takePictureAsync({ quality: 0.6 });
    if (photo?.uri) onCapture(photo.uri);
  };

  return (
    <Step title="Facial capture" subtitle="Center your face in the frame" onNext={onNext} onBack={onBack} nextLabel={uri ? 'Continue' : 'Skip for now'}>
      <View className="aspect-square w-full overflow-hidden rounded-xl bg-offWhite">
        {uri ? (
          <Text className="p-4 font-dmsans text-body-small text-warmGray">Photo captured — looking good!</Text>
        ) : (
          <CameraView ref={setCameraRef} style={{ flex: 1 }} facing="front" />
        )}
      </View>
      {!uri ? (
        <View className="mt-5">
          <Button variant="secondary" onPress={handleCapture}>Capture Photo</Button>
        </View>
      ) : null}
    </Step>
  );
}

/* ── PIN setup ── */
function PinSetupStep({
  pin,
  confirmPin,
  onChangePin,
  onChangeConfirm,
  onBack,
  onComplete,
}: {
  pin: string;
  confirmPin: string;
  onChangePin: (v: string) => void;
  onChangeConfirm: (v: string) => void;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Step title="Create a PIN" subtitle="You'll use this to sign in quickly" onNext={() => setConfirming(true)} onBack={onBack}>
        <View className="items-center">
          <PinInput length={4} value={pin} onChange={onChangePin} />
        </View>
      </Step>
    );
  }

  return (
    <Step
      title="Confirm your PIN"
      subtitle="Enter it one more time"
      onNext={() => confirmPin === pin && confirmPin.length === 4 && onComplete()}
      onBack={() => setConfirming(false)}
      nextLabel="Finish"
    >
      <View className="items-center gap-3">
        <PinInput length={4} value={confirmPin} onChange={onChangeConfirm} />
        {confirmPin.length === 4 && confirmPin !== pin ? (
          <Text className="font-dmsans text-caption text-[#C92727]">PINs do not match</Text>
        ) : null}
      </View>
    </Step>
  );
}
