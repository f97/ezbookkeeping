package datatable

import (
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/mayswind/ezbookkeeping/pkg/core"
	"github.com/mayswind/ezbookkeeping/pkg/errs"
	"github.com/mayswind/ezbookkeeping/pkg/log"
	"github.com/mayswind/ezbookkeeping/pkg/models"
	"github.com/mayswind/ezbookkeeping/pkg/utils"
	"github.com/mayswind/ezbookkeeping/pkg/validators"
)

// DataTableTransactionDataExporter defines the structure of plain text data table exporter for transaction data
type DataTableTransactionDataExporter struct {
	transactionTypeMapping  map[models.TransactionType]string
	geoLocationSeparator    string
	transactionTagSeparator string
}

// DataTableTransactionDataImporter defines the structure of plain text data table importer for transaction data
type DataTableTransactionDataImporter struct {
	transactionTypeMapping  map[models.TransactionType]string
	geoLocationSeparator    string
	transactionTagSeparator string
}

// CreateNewExporter returns a new data table transaction data exporter according to the specified arguments
func CreateNewExporter(transactionTypeMapping map[models.TransactionType]string, geoLocationSeparator string, transactionTagSeparator string) *DataTableTransactionDataExporter {
	return &DataTableTransactionDataExporter{
		transactionTypeMapping:  transactionTypeMapping,
		geoLocationSeparator:    geoLocationSeparator,
		transactionTagSeparator: transactionTagSeparator,
	}
}

// CreateNewImporter returns a new data table transaction data importer according to the specified arguments
func CreateNewImporter(transactionTypeMapping map[models.TransactionType]string, geoLocationSeparator string, transactionTagSeparator string) *DataTableTransactionDataImporter {
	return &DataTableTransactionDataImporter{
		transactionTypeMapping:  transactionTypeMapping,
		geoLocationSeparator:    geoLocationSeparator,
		transactionTagSeparator: transactionTagSeparator,
	}
}

// CreateNewSimpleImporter returns a new data table transaction data importer according to the specified arguments
func CreateNewSimpleImporter(transactionTypeMapping map[models.TransactionType]string) *DataTableTransactionDataImporter {
	return &DataTableTransactionDataImporter{
		transactionTypeMapping: transactionTypeMapping,
	}
}

// BuildExportedContent writes the exported transaction data to the data table builder
func (c *DataTableTransactionDataExporter) BuildExportedContent(ctx core.Context, dataTableBuilder TransactionDataTableBuilder, uid int64, transactions []*models.Transaction, accountMap map[int64]*models.Account, categoryMap map[int64]*models.TransactionCategory, tagMap map[int64]*models.TransactionTag, allTagIndexes map[int64][]int64) error {
	for i := 0; i < len(transactions); i++ {
		transaction := transactions[i]

		if transaction.Type == models.TRANSACTION_DB_TYPE_TRANSFER_IN {
			continue
		}

		dataRowMap := make(map[TransactionDataTableColumn]string, 15)
		transactionTimeZone := time.FixedZone("Transaction Timezone", int(transaction.TimezoneUtcOffset)*60)

		dataRowMap[TRANSACTION_DATA_TABLE_TRANSACTION_TIME] = utils.FormatUnixTimeToLongDateTime(utils.GetUnixTimeFromTransactionTime(transaction.TransactionTime), transactionTimeZone)
		dataRowMap[TRANSACTION_DATA_TABLE_TRANSACTION_TIMEZONE] = utils.FormatTimezoneOffset(transactionTimeZone)
		dataRowMap[TRANSACTION_DATA_TABLE_TRANSACTION_TYPE] = dataTableBuilder.ReplaceDelimiters(c.getDisplayTransactionTypeName(transaction.Type))
		dataRowMap[TRANSACTION_DATA_TABLE_CATEGORY] = c.getExportedTransactionCategoryName(dataTableBuilder, transaction.CategoryId, categoryMap)
		dataRowMap[TRANSACTION_DATA_TABLE_SUB_CATEGORY] = c.getExportedTransactionSubCategoryName(dataTableBuilder, transaction.CategoryId, categoryMap)
		dataRowMap[TRANSACTION_DATA_TABLE_ACCOUNT_NAME] = c.getExportedAccountName(dataTableBuilder, transaction.AccountId, accountMap)
		dataRowMap[TRANSACTION_DATA_TABLE_ACCOUNT_CURRENCY] = c.getAccountCurrency(dataTableBuilder, transaction.AccountId, accountMap)
		dataRowMap[TRANSACTION_DATA_TABLE_AMOUNT] = utils.FormatAmount(transaction.Amount)

		if transaction.Type == models.TRANSACTION_DB_TYPE_TRANSFER_OUT {
			dataRowMap[TRANSACTION_DATA_TABLE_RELATED_ACCOUNT_NAME] = c.getExportedAccountName(dataTableBuilder, transaction.RelatedAccountId, accountMap)
			dataRowMap[TRANSACTION_DATA_TABLE_RELATED_ACCOUNT_CURRENCY] = c.getAccountCurrency(dataTableBuilder, transaction.RelatedAccountId, accountMap)
			dataRowMap[TRANSACTION_DATA_TABLE_RELATED_AMOUNT] = utils.FormatAmount(transaction.RelatedAccountAmount)
		}

		dataRowMap[TRANSACTION_DATA_TABLE_GEOGRAPHIC_LOCATION] = c.getExportedGeographicLocation(transaction)
		dataRowMap[TRANSACTION_DATA_TABLE_TAGS] = c.getExportedTags(dataTableBuilder, transaction.TransactionId, allTagIndexes, tagMap)
		dataRowMap[TRANSACTION_DATA_TABLE_DESCRIPTION] = dataTableBuilder.ReplaceDelimiters(transaction.Comment)

		dataTableBuilder.AppendTransaction(dataRowMap)
	}

	return nil
}

func (c *DataTableTransactionDataExporter) getDisplayTransactionTypeName(transactionDbType models.TransactionDbType) string {
	transactionType, err := transactionDbType.ToTransactionType()

	if err != nil {
		return ""
	}

	transactionTypeName, exists := c.transactionTypeMapping[transactionType]

	if !exists {
		return ""
	}

	return transactionTypeName
}

func (c *DataTableTransactionDataExporter) getExportedTransactionCategoryName(dataTableBuilder TransactionDataTableBuilder, categoryId int64, categoryMap map[int64]*models.TransactionCategory) string {
	category, exists := categoryMap[categoryId]

	if !exists {
		return ""
	}

	if category.ParentCategoryId == 0 {
		return dataTableBuilder.ReplaceDelimiters(category.Name)
	}

	parentCategory, exists := categoryMap[category.ParentCategoryId]

	if !exists {
		return ""
	}

	return dataTableBuilder.ReplaceDelimiters(parentCategory.Name)
}

func (c *DataTableTransactionDataExporter) getExportedTransactionSubCategoryName(dataTableBuilder TransactionDataTableBuilder, categoryId int64, categoryMap map[int64]*models.TransactionCategory) string {
	category, exists := categoryMap[categoryId]

	if exists {
		return dataTableBuilder.ReplaceDelimiters(category.Name)
	} else {
		return ""
	}
}

func (c *DataTableTransactionDataExporter) getExportedAccountName(dataTableBuilder TransactionDataTableBuilder, accountId int64, accountMap map[int64]*models.Account) string {
	account, exists := accountMap[accountId]

	if exists {
		return dataTableBuilder.ReplaceDelimiters(account.Name)
	} else {
		return ""
	}
}

func (c *DataTableTransactionDataExporter) getAccountCurrency(dataTableBuilder TransactionDataTableBuilder, accountId int64, accountMap map[int64]*models.Account) string {
	account, exists := accountMap[accountId]

	if exists {
		return dataTableBuilder.ReplaceDelimiters(account.Currency)
	} else {
		return ""
	}
}

func (c *DataTableTransactionDataExporter) getExportedGeographicLocation(transaction *models.Transaction) string {
	if transaction.GeoLongitude != 0 || transaction.GeoLatitude != 0 {
		return fmt.Sprintf("%f%s%f", transaction.GeoLongitude, c.geoLocationSeparator, transaction.GeoLatitude)
	}

	return ""
}

func (c *DataTableTransactionDataExporter) getExportedTags(dataTableBuilder TransactionDataTableBuilder, transactionId int64, allTagIndexes map[int64][]int64, tagMap map[int64]*models.TransactionTag) string {
	tagIndexes, exists := allTagIndexes[transactionId]

	if !exists {
		return ""
	}

	var ret strings.Builder

	for i := 0; i < len(tagIndexes); i++ {
		tagIndex := tagIndexes[i]
		tag, exists := tagMap[tagIndex]

		if !exists {
			continue
		}

		if ret.Len() > 0 {
			ret.WriteString(c.transactionTagSeparator)
		}

		ret.WriteString(strings.Replace(tag.Name, c.transactionTagSeparator, " ", -1))
	}

	return dataTableBuilder.ReplaceDelimiters(ret.String())
}

// ParseImportedData returns the imported transaction data
func (c *DataTableTransactionDataImporter) ParseImportedData(ctx core.Context, user *models.User, dataTable TransactionDataTable, defaultTimezoneOffset int16, accountMap map[string]*models.Account, expenseCategoryMap map[string]*models.TransactionCategory, incomeCategoryMap map[string]*models.TransactionCategory, transferCategoryMap map[string]*models.TransactionCategory, tagMap map[string]*models.TransactionTag) (models.ImportedTransactionSlice, []*models.Account, []*models.TransactionCategory, []*models.TransactionCategory, []*models.TransactionCategory, []*models.TransactionTag, error) {
	if dataTable.TransactionRowCount() < 1 {
		log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse import data for user \"uid:%d\", because data table row count is less 1", user.Uid)
		return nil, nil, nil, nil, nil, nil, errs.ErrNotFoundTransactionDataInFile
	}

	nameDbTypeMap, err := c.buildTransactionTypeNameDbTypeMap()

	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	if !dataTable.HasColumn(TRANSACTION_DATA_TABLE_TRANSACTION_TIME) ||
		!dataTable.HasColumn(TRANSACTION_DATA_TABLE_TRANSACTION_TYPE) ||
		!dataTable.HasColumn(TRANSACTION_DATA_TABLE_SUB_CATEGORY) ||
		!dataTable.HasColumn(TRANSACTION_DATA_TABLE_ACCOUNT_NAME) ||
		!dataTable.HasColumn(TRANSACTION_DATA_TABLE_AMOUNT) ||
		!dataTable.HasColumn(TRANSACTION_DATA_TABLE_RELATED_ACCOUNT_NAME) {
		log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse import data for user \"uid:%d\", because missing essential columns in header row", user.Uid)
		return nil, nil, nil, nil, nil, nil, errs.ErrMissingRequiredFieldInHeaderRow
	}

	if accountMap == nil {
		accountMap = make(map[string]*models.Account)
	}

	if expenseCategoryMap == nil {
		expenseCategoryMap = make(map[string]*models.TransactionCategory)
	}

	if incomeCategoryMap == nil {
		incomeCategoryMap = make(map[string]*models.TransactionCategory)
	}

	if transferCategoryMap == nil {
		transferCategoryMap = make(map[string]*models.TransactionCategory)
	}

	if tagMap == nil {
		tagMap = make(map[string]*models.TransactionTag)
	}

	allNewTransactions := make(models.ImportedTransactionSlice, 0, dataTable.TransactionRowCount())
	allNewAccounts := make([]*models.Account, 0)
	allNewSubExpenseCategories := make([]*models.TransactionCategory, 0)
	allNewSubIncomeCategories := make([]*models.TransactionCategory, 0)
	allNewSubTransferCategories := make([]*models.TransactionCategory, 0)
	allNewTags := make([]*models.TransactionTag, 0)

	dataRowIterator := dataTable.TransactionRowIterator()
	dataRowIndex := 0

	for dataRowIterator.HasNext() {
		dataRowIndex++
		dataRow, err := dataRowIterator.Next(ctx, user)

		if err != nil {
			log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse data row \"index:%d\" for user \"uid:%d\", because %s", dataRowIndex, user.Uid, err.Error())
			return nil, nil, nil, nil, nil, nil, err
		}

		if !dataRow.IsValid() {
			continue
		}

		timezoneOffset := defaultTimezoneOffset

		if dataTable.HasColumn(TRANSACTION_DATA_TABLE_TRANSACTION_TIMEZONE) {
			transactionTimezone, err := utils.ParseFromTimezoneOffset(dataRow.GetData(TRANSACTION_DATA_TABLE_TRANSACTION_TIMEZONE))

			if err != nil {
				log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse time zone \"%s\" in data row \"index:%d\" for user \"uid:%d\", because %s", dataRow.GetData(TRANSACTION_DATA_TABLE_TRANSACTION_TIMEZONE), dataRowIndex, user.Uid, err.Error())
				return nil, nil, nil, nil, nil, nil, errs.ErrTransactionTimeZoneInvalid
			}

			timezoneOffset = utils.GetTimezoneOffsetMinutes(transactionTimezone)
		}

		transactionTime, err := utils.ParseFromLongDateTime(dataRow.GetData(TRANSACTION_DATA_TABLE_TRANSACTION_TIME), timezoneOffset)

		if err != nil {
			log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse time \"%s\" in data row \"index:%d\" for user \"uid:%d\", because %s", dataRow.GetData(TRANSACTION_DATA_TABLE_TRANSACTION_TIME), dataRowIndex, user.Uid, err.Error())
			return nil, nil, nil, nil, nil, nil, errs.ErrTransactionTimeInvalid
		}

		transactionDbType, err := c.getTransactionDbType(nameDbTypeMap, dataRow.GetData(TRANSACTION_DATA_TABLE_TRANSACTION_TYPE))

		if err != nil {
			log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse transaction type \"%s\" in data row \"index:%d\" for user \"uid:%d\", because %s", dataRow.GetData(TRANSACTION_DATA_TABLE_TRANSACTION_TYPE), dataRowIndex, user.Uid, err.Error())
			return nil, nil, nil, nil, nil, nil, errs.Or(err, errs.ErrTransactionTypeInvalid)
		}

		categoryId := int64(0)
		subCategoryName := ""

		if transactionDbType != models.TRANSACTION_DB_TYPE_MODIFY_BALANCE {
			transactionCategoryType, err := c.getTransactionCategoryType(transactionDbType)

			if err != nil {
				log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse transaction category type in data row \"index:%d\" for user \"uid:%d\", because %s", dataRowIndex, user.Uid, err.Error())
				return nil, nil, nil, nil, nil, nil, errs.Or(err, errs.ErrTransactionTypeInvalid)
			}

			subCategoryName = dataRow.GetData(TRANSACTION_DATA_TABLE_SUB_CATEGORY)

			if transactionDbType == models.TRANSACTION_DB_TYPE_EXPENSE {
				subCategory, exists := expenseCategoryMap[subCategoryName]

				if !exists {
					subCategory = c.createNewTransactionCategoryModel(user.Uid, subCategoryName, transactionCategoryType)
					allNewSubExpenseCategories = append(allNewSubExpenseCategories, subCategory)
					expenseCategoryMap[subCategoryName] = subCategory
				}

				categoryId = subCategory.CategoryId
			} else if transactionDbType == models.TRANSACTION_DB_TYPE_INCOME {
				subCategory, exists := incomeCategoryMap[subCategoryName]

				if !exists {
					subCategory = c.createNewTransactionCategoryModel(user.Uid, subCategoryName, transactionCategoryType)
					allNewSubIncomeCategories = append(allNewSubIncomeCategories, subCategory)
					incomeCategoryMap[subCategoryName] = subCategory
				}

				categoryId = subCategory.CategoryId
			} else if transactionDbType == models.TRANSACTION_DB_TYPE_TRANSFER_OUT {
				subCategory, exists := transferCategoryMap[subCategoryName]

				if !exists {
					subCategory = c.createNewTransactionCategoryModel(user.Uid, subCategoryName, transactionCategoryType)
					allNewSubTransferCategories = append(allNewSubTransferCategories, subCategory)
					transferCategoryMap[subCategoryName] = subCategory
				}

				categoryId = subCategory.CategoryId
			}
		}

		accountName := dataRow.GetData(TRANSACTION_DATA_TABLE_ACCOUNT_NAME)
		accountCurrency := user.DefaultCurrency

		if dataTable.HasColumn(TRANSACTION_DATA_TABLE_ACCOUNT_CURRENCY) {
			accountCurrency = dataRow.GetData(TRANSACTION_DATA_TABLE_ACCOUNT_CURRENCY)

			if _, ok := validators.AllCurrencyNames[accountCurrency]; !ok {
				log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] account currency \"%s\" is not supported in data row \"index:%d\" for user \"uid:%d\"", accountCurrency, dataRowIndex, user.Uid)
				return nil, nil, nil, nil, nil, nil, errs.ErrAccountCurrencyInvalid
			}
		}

		account, exists := accountMap[accountName]

		if !exists {
			account = c.createNewAccountModel(user.Uid, accountName, accountCurrency)
			allNewAccounts = append(allNewAccounts, account)
			accountMap[accountName] = account
		}

		if dataTable.HasColumn(TRANSACTION_DATA_TABLE_ACCOUNT_CURRENCY) {
			if account.Name != "" && account.Currency != accountCurrency {
				log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] currency \"%s\" in data row \"index:%d\" not equals currency \"%s\" of the account for user \"uid:%d\"", accountCurrency, dataRowIndex, account.Currency, user.Uid)
				return nil, nil, nil, nil, nil, nil, errs.ErrAccountCurrencyInvalid
			}
		} else if exists {
			accountCurrency = account.Currency
		}

		amount, err := utils.ParseAmount(dataRow.GetData(TRANSACTION_DATA_TABLE_AMOUNT))

		if err != nil {
			log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse acmount \"%s\" in data row \"index:%d\" for user \"uid:%d\", because %s", dataRow.GetData(TRANSACTION_DATA_TABLE_AMOUNT), dataRowIndex, user.Uid, err.Error())
			return nil, nil, nil, nil, nil, nil, errs.ErrAmountInvalid
		}

		relatedAccountId := int64(0)
		relatedAccountAmount := int64(0)
		account2Name := ""
		account2Currency := ""

		if transactionDbType == models.TRANSACTION_DB_TYPE_TRANSFER_OUT {
			account2Name = dataRow.GetData(TRANSACTION_DATA_TABLE_RELATED_ACCOUNT_NAME)
			account2Currency = user.DefaultCurrency

			if dataTable.HasColumn(TRANSACTION_DATA_TABLE_RELATED_ACCOUNT_CURRENCY) {
				account2Currency = dataRow.GetData(TRANSACTION_DATA_TABLE_RELATED_ACCOUNT_CURRENCY)

				if _, ok := validators.AllCurrencyNames[account2Currency]; !ok {
					log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] account2 currency \"%s\" is not supported in data row \"index:%d\" for user \"uid:%d\"", account2Currency, dataRowIndex, user.Uid)
					return nil, nil, nil, nil, nil, nil, errs.ErrAccountCurrencyInvalid
				}
			}

			account2, exists := accountMap[account2Name]

			if !exists {
				account2 = c.createNewAccountModel(user.Uid, account2Name, account2Currency)
				allNewAccounts = append(allNewAccounts, account2)
				accountMap[account2Name] = account2
			}

			if dataTable.HasColumn(TRANSACTION_DATA_TABLE_RELATED_ACCOUNT_CURRENCY) {
				if account2.Name != "" && account2.Currency != account2Currency {
					log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] currency \"%s\" in data row \"index:%d\" not equals currency \"%s\" of the account2 for user \"uid:%d\"", account2Currency, dataRowIndex, account2.Currency, user.Uid)
					return nil, nil, nil, nil, nil, nil, errs.ErrAccountCurrencyInvalid
				}
			} else if exists {
				account2Currency = account2.Currency
			}

			relatedAccountId = account2.AccountId

			if dataTable.HasColumn(TRANSACTION_DATA_TABLE_RELATED_AMOUNT) {
				relatedAccountAmount, err = utils.ParseAmount(dataRow.GetData(TRANSACTION_DATA_TABLE_RELATED_AMOUNT))

				if err != nil {
					log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse acmount2 \"%s\" in data row \"index:%d\" for user \"uid:%d\", because %s", dataRow.GetData(TRANSACTION_DATA_TABLE_RELATED_AMOUNT), dataRowIndex, user.Uid, err.Error())
					return nil, nil, nil, nil, nil, nil, errs.ErrAmountInvalid
				}
			} else if transactionDbType == models.TRANSACTION_DB_TYPE_TRANSFER_OUT {
				relatedAccountAmount = amount
			}
		}

		geoLongitude := float64(0)
		geoLatitude := float64(0)

		if dataTable.HasColumn(TRANSACTION_DATA_TABLE_GEOGRAPHIC_LOCATION) && c.geoLocationSeparator != "" {
			geoLocationItems := strings.Split(dataRow.GetData(TRANSACTION_DATA_TABLE_GEOGRAPHIC_LOCATION), c.geoLocationSeparator)

			if len(geoLocationItems) == 2 {
				geoLongitude, err = utils.StringToFloat64(geoLocationItems[0])

				if err != nil {
					log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse geographic location \"%s\" in data row \"index:%d\" for user \"uid:%d\", because %s", dataRow.GetData(TRANSACTION_DATA_TABLE_GEOGRAPHIC_LOCATION), dataRowIndex, user.Uid, err.Error())
					return nil, nil, nil, nil, nil, nil, errs.ErrGeographicLocationInvalid
				}

				geoLatitude, err = utils.StringToFloat64(geoLocationItems[1])

				if err != nil {
					log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] cannot parse geographic location \"%s\" in data row \"index:%d\" for user \"uid:%d\", because %s", dataRow.GetData(TRANSACTION_DATA_TABLE_GEOGRAPHIC_LOCATION), dataRowIndex, user.Uid, err.Error())
					return nil, nil, nil, nil, nil, nil, errs.ErrGeographicLocationInvalid
				}
			}
		}

		var tagIds []string
		var tagNames []string

		if dataTable.HasColumn(TRANSACTION_DATA_TABLE_TAGS) {
			var tagNameItems []string

			if c.transactionTagSeparator != "" {
				tagNameItems = strings.Split(dataRow.GetData(TRANSACTION_DATA_TABLE_TAGS), c.transactionTagSeparator)
			} else {
				tagNameItems = append(tagNameItems, dataRow.GetData(TRANSACTION_DATA_TABLE_TAGS))
			}

			for i := 0; i < len(tagNameItems); i++ {
				tagName := tagNameItems[i]

				if tagName == "" {
					continue
				}

				tag, exists := tagMap[tagName]

				if !exists {
					tag = c.createNewTransactionTagModel(user.Uid, tagName)
					allNewTags = append(allNewTags, tag)
					tagMap[tagName] = tag
				}

				if tag != nil {
					tagIds = append(tagIds, utils.Int64ToString(tag.TagId))
				}

				tagNames = append(tagNames, tagName)
			}
		}

		description := ""

		if dataTable.HasColumn(TRANSACTION_DATA_TABLE_DESCRIPTION) {
			description = dataRow.GetData(TRANSACTION_DATA_TABLE_DESCRIPTION)
		}

		transaction := &models.ImportTransaction{
			Transaction: &models.Transaction{
				Uid:                  user.Uid,
				Type:                 transactionDbType,
				CategoryId:           categoryId,
				TransactionTime:      utils.GetMinTransactionTimeFromUnixTime(transactionTime.Unix()),
				TimezoneUtcOffset:    timezoneOffset,
				AccountId:            account.AccountId,
				Amount:               amount,
				HideAmount:           false,
				RelatedAccountId:     relatedAccountId,
				RelatedAccountAmount: relatedAccountAmount,
				Comment:              description,
				GeoLongitude:         geoLongitude,
				GeoLatitude:          geoLatitude,
				CreatedIp:            "127.0.0.1",
			},
			TagIds:                             tagIds,
			OriginalCategoryName:               subCategoryName,
			OriginalSourceAccountName:          accountName,
			OriginalSourceAccountCurrency:      accountCurrency,
			OriginalDestinationAccountName:     account2Name,
			OriginalDestinationAccountCurrency: account2Currency,
			OriginalTagNames:                   tagNames,
		}

		allNewTransactions = append(allNewTransactions, transaction)
	}

	if len(allNewTransactions) < 1 {
		log.Errorf(ctx, "[data_table_transaction_data_converter.parseImportedData] no transaction data parsed for \"uid:%d\"", user.Uid)
		return nil, nil, nil, nil, nil, nil, errs.ErrNotFoundTransactionDataInFile
	}

	sort.Sort(allNewTransactions)

	return allNewTransactions, allNewAccounts, allNewSubExpenseCategories, allNewSubIncomeCategories, allNewSubTransferCategories, allNewTags, nil
}

func (c *DataTableTransactionDataImporter) buildTransactionTypeNameDbTypeMap() (map[string]models.TransactionDbType, error) {
	if c.transactionTypeMapping == nil {
		return nil, errs.ErrTransactionTypeInvalid
	}

	nameDbTypeMap := make(map[string]models.TransactionDbType, len(c.transactionTypeMapping))
	nameDbTypeMap[c.transactionTypeMapping[models.TRANSACTION_TYPE_MODIFY_BALANCE]] = models.TRANSACTION_DB_TYPE_MODIFY_BALANCE
	nameDbTypeMap[c.transactionTypeMapping[models.TRANSACTION_TYPE_INCOME]] = models.TRANSACTION_DB_TYPE_INCOME
	nameDbTypeMap[c.transactionTypeMapping[models.TRANSACTION_TYPE_EXPENSE]] = models.TRANSACTION_DB_TYPE_EXPENSE
	nameDbTypeMap[c.transactionTypeMapping[models.TRANSACTION_TYPE_TRANSFER]] = models.TRANSACTION_DB_TYPE_TRANSFER_OUT

	return nameDbTypeMap, nil
}

func (c *DataTableTransactionDataImporter) getTransactionDbType(nameDbTypeMap map[string]models.TransactionDbType, transactionTypeName string) (models.TransactionDbType, error) {
	transactionType, exists := nameDbTypeMap[transactionTypeName]

	if !exists {
		return 0, errs.ErrTransactionTypeInvalid
	}

	return transactionType, nil
}

func (c *DataTableTransactionDataImporter) getTransactionCategoryType(transactionType models.TransactionDbType) (models.TransactionCategoryType, error) {
	if transactionType == models.TRANSACTION_DB_TYPE_INCOME {
		return models.CATEGORY_TYPE_INCOME, nil
	} else if transactionType == models.TRANSACTION_DB_TYPE_EXPENSE {
		return models.CATEGORY_TYPE_EXPENSE, nil
	} else if transactionType == models.TRANSACTION_DB_TYPE_TRANSFER_OUT {
		return models.CATEGORY_TYPE_TRANSFER, nil
	} else {
		return 0, errs.ErrTransactionTypeInvalid
	}
}

func (c *DataTableTransactionDataImporter) createNewAccountModel(uid int64, accountName string, currency string) *models.Account {
	return &models.Account{
		Uid:      uid,
		Name:     accountName,
		Currency: currency,
	}
}

func (c *DataTableTransactionDataImporter) createNewTransactionCategoryModel(uid int64, categoryName string, transactionCategoryType models.TransactionCategoryType) *models.TransactionCategory {
	return &models.TransactionCategory{
		Uid:  uid,
		Name: categoryName,
		Type: transactionCategoryType,
	}
}

func (c *DataTableTransactionDataImporter) createNewTransactionTagModel(uid int64, tagName string) *models.TransactionTag {
	return &models.TransactionTag{
		Uid:  uid,
		Name: tagName,
	}
}
