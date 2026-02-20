import React, { forwardRef, useMemo } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";

type Props = {
  children: React.ReactNode;
  snapPoints?: string[];
  theme: {
    card: string;
  };
};

export const AppBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ children, snapPoints = ["50%"], theme }, ref) => {
    const memoSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={memoSnapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}
        backgroundStyle={{
          backgroundColor: theme.card,
        }}
      >
        {children}
      </BottomSheetModal>
    );
  }
);
