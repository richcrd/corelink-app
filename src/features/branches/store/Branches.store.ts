import { create } from "zustand";
import type { BranchDto } from "../types/Branch";

type BranchesStore = {
  branches: BranchDto[];
  selectedBranchId: number | null;
  setBranches: (branches: BranchDto[]) => void;
  selectBranch: (branchId: number) => void;
};

export const useBranchesStore = create<BranchesStore>((set, get) => ({
  branches: [],
  selectedBranchId: null,

  setBranches: (branches) => {
    const selectedBranchId = get().selectedBranchId;
    const hasSelected = !!selectedBranchId && branches.some((b) => b.id === selectedBranchId);

    set({
      branches,
      selectedBranchId: hasSelected ? selectedBranchId : (branches[0]?.id ?? null),
    });
  },

  selectBranch: (branchId) => {
    set({ selectedBranchId: branchId });
  },
}));
