export const routerPaths = {
  homePage: '/',
  playground: '/playground',
  worker: {
    signIn: '/worker/sign-in',
    signUp: '/worker/sign-up',
    resetPassword: '/reset-password',
    resetPasswordSuccess: '/worker/reset-password-success',
    sendResetLink: '/worker/send-reset-link',
    sendResetLinkSuccess: '/worker/send-reset-link-success',
    emailVerification: '/verify',
    sendEmailVerification: '/worker/send-email-verification',
    profile: '/worker/profile',
    jobs: '/worker/jobs',
  },
  operator: {
    signIn: '/operator/sign-in',
    connectWallet: '/operator/connect-wallet',
    addStake: '/operator/add-stake',
    addKeys: '/operator/add-keys',
    editExistingKeysSuccess: '/operator/edit-existing-keys-success',
    profile: '/operator/profile',
  },
} as const;