package errs

import (
	"net/http"
)

// Error codes related to oauth 2.0
var (
	ErrOAuth2NotEnabled                 = NewNormalError(NormalSubcategoryOAuth2, 0, http.StatusBadRequest, "oauth2 not enabled")
	ErrOAuth2AutoRegistrationNotEnabled = NewNormalError(NormalSubcategoryOAuth2, 1, http.StatusBadRequest, "oauth2 auto registration not enabled")
	ErrInvalidOAuth2LoginRequest        = NewNormalError(NormalSubcategoryOAuth2, 2, http.StatusBadRequest, "invalid oauth2 login request")
	ErrInvalidOAuth2Callback            = NewNormalError(NormalSubcategoryOAuth2, 3, http.StatusBadRequest, "invalid oauth2 callback")
	ErrMissingOAuth2State               = NewNormalError(NormalSubcategoryOAuth2, 4, http.StatusBadRequest, "missing state in oauth2 callback")
	ErrMissingOAuth2Code                = NewNormalError(NormalSubcategoryOAuth2, 5, http.StatusBadRequest, "missing code in oauth2 callback")
	ErrInvalidOAuth2State               = NewNormalError(NormalSubcategoryOAuth2, 6, http.StatusBadRequest, "invalid state in oauth2 callback")
	ErrCannotRetrieveOAuth2Token        = NewNormalError(NormalSubcategoryOAuth2, 7, http.StatusBadRequest, "cannot retrieve oauth2 token")
	ErrInvalidOAuth2Token               = NewNormalError(NormalSubcategoryOAuth2, 8, http.StatusBadRequest, "invalid oauth2 token")
	ErrCannotRetrieveUserInfo           = NewNormalError(NormalSubcategoryOAuth2, 9, http.StatusBadRequest, "cannot retrieve user info from oauth2 provider")
)
